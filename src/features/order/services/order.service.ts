import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entities/order-history.entity';
import { Order } from '../entities/order.entity';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { UserRole } from '../../user/entities/role_user.enum';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Cart } from '../../cart/cart/entities/cart.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { Address } from '../../address/entities/address.entity';
import { PreviewOrderDto } from '../dto/preview-order.dto';
import { Store } from '../../store/entities/store.entity';
import { deliveryFee, DeliveryMethod } from '../entities/delivery-method.enum';
import { SystemService } from '../../system/system.service';
import { mapToOrder } from '../mapper/order.mapper';
import { Product } from '../../product/product/entities/product.entity';
import { ProductTypeItem } from '../../product/product-type-item/entities/product-type-item.entity';
import { CartItem } from '../../cart/cart-item/entities/cart-item.entity';
import { Wallet } from '../../wallet/wallet/entities/wallet.entity';
import { WalletTransactionType } from '../../wallet/wallet-transaction/entities/wallet-transaction-type.enum';
import { OrderStatus } from '../entities/order-status.enum';
import { FindOrderDto } from '../dto/find-order.dto';
import { DiscountService } from '../../discount/discount/discount.service';
import { Voucher } from 'src/features/discount/voucher/entities/voucher.entity';
import { VoucherService } from 'src/features/discount/voucher/voucher.service';
import { JobService } from 'src/features/job/job.service';
import { WalletTransactionService } from 'src/features/wallet/wallet-transaction/wallet-transaction.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private readonly deliveryService:DeliveryService,
    private readonly systemService:SystemService,
    private readonly discountService:DiscountService,
    private readonly voucherService:VoucherService,
    private readonly jobService:JobService,
    private readonly walletTransactionService : WalletTransactionService,
    private dataSource:DataSource
  ) {}

  async preview(payload:Payload,dto:PreviewOrderDto) {
    let cart = await this.cartRepository.findOne({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        cartItems:{
          product:{
            promo:{
              discount:true
            }
          },
          cartProductTypes:{
            productType:true,
            cartProductTypeItems:{
              productTypeItem:true
            }
          }
        },
        buyer:true
      }
    })
    if(!cart){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Cart'))
    }
    
    cart = await this.validatePromoItem(cart,payload.userRoleId)
    const order = await this.buildOrder(payload,dto,cart)
    return order;
  }

  private async overdue(deliveryMethod:DeliveryMethod){
    const date = await this.systemService.getBusinessDate()
    switch(deliveryMethod){
      case DeliveryMethod.INSTANT:
        date.setHours(date.getHours() + 3)
        break;

      case DeliveryMethod.NEXT_DAY:
        date.setDate(date.getDate() + 1)
        break;

      case DeliveryMethod.REGULAR:
        date.setDate(date.getDate() + 3)
        break
    }
    return date
  }

  private async validationStock(cart:Cart,manager:EntityManager){
    for (const cartItem of cart.cartItems){
      const product = await manager
      .getRepository(Product)
      .createQueryBuilder("product")
      .setLock('pessimistic_write')
      .where("product.id = :id",{
        id:cartItem.product.id
      })
      .getOne()

      if(!product){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Product"))
      }
      if (product.stock < cartItem.quantity){
        throw new BadRequestException(exceptionMessage(ExceptionType.DEFAULT,`Checkout ${cartItem.product.name} stock is insufficient `))
      }
      for (const type of cartItem.cartProductTypes){
        for(const item of type.cartProductTypeItems){
          const productTypeItem = await manager.getRepository(ProductTypeItem)
          .createQueryBuilder("productTypeItem")
          .setLock('pessimistic_write')
          .where("productTypeItem.id = :id",{
            id:item.productTypeItem.id
          })
          .getOne()

          if(!productTypeItem){
            throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Product Type Item"))
          }

          if(productTypeItem.stock < cartItem.quantity){
            throw new BadRequestException(exceptionMessage(ExceptionType.DEFAULT,`Checkout ${item.productTypeItem.name} stock is insufficient `))
          }
        }
      }
    }
  }

  private async reduceStock(
    manager:EntityManager,
    cart:Cart
  ){
    for (const cartItem of cart.cartItems){
      await manager.decrement(
        Product,
        {
          id:cartItem.product.id
        },
        "stock",
        cartItem.quantity
      )

      for (const type of cartItem.cartProductTypes){
        for (const item of type.cartProductTypeItems){
          await manager.decrement(
            ProductTypeItem,
            {
              id:item.productTypeItem.id
            },
            "stock",
            cartItem.quantity
          )
        }
      }
    }
  }

  private async clearCart(
    manager:EntityManager,
    cart:Cart
  ){
    
    await manager.remove(cart.cartItems)
    
    cart.cartItems = []
    cart.sub_total = 0
    cart.store_id = null
    await manager.save(cart)
    // throw new UnauthorizedException("ERROR GEDE")
  }

  private ppnCalculation(subTotal:number){
    return subTotal * 0.12
  }

  async create(
    payload:Payload,
    dto:PreviewOrderDto
  ) {
    return await this.dataSource.transaction(
      async manager => {
        let cart = await manager.findOne(
          Cart,
          {
            where:{
              buyer:{
                id:payload.userRoleId
              }
            },
            relations:{
              cartItems:{
                product:{
                  promo:{
                    discount:true
                  },
                },
                cartProductTypes:{
                  cartProductTypeItems:{
                    productTypeItem:true
                  },
                  productType:true
                },
              },
              buyer:true
            }
          }
        )

        if(!cart){
          throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Cart"))
        }

        if(cart.cartItems.length === 0){
          throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Cart is empty'))
        }

        const wallet = await manager
        .getRepository(Wallet)
        .createQueryBuilder("wallet")
        .setLock("pessimistic_write")
        .leftJoin("wallet.user","user")
        .where("user.id = :id",{
          id:payload.sub
        })
        .getOne()

        if(!wallet){
          throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Wallet"))
        }
        cart = await this.validatePromoItem(cart,payload.userRoleId)
        
        const promoItems = cart.cartItems.filter(
          item => item.product.promo
        )
        await this.validationStock(cart,manager)
        const order = await this.buildOrder(
          payload,
          dto,
          cart,
          OrderStatus.PROCCESS
        )
        const saveOrder = await manager.save(order)
      
        await this.walletTransactionService.processPaymentOrder(manager,wallet,WalletTransactionType.PAYMENT,`Payment Order #${saveOrder.id}`,saveOrder.total_fee,payload.sub,order.store.seller.id,saveOrder.id)
        await this.jobService.create(saveOrder,manager)
        if(dto.voucher_code){
          await this.discountService.addDiscountUsage(
          manager,
          payload.userRoleId,
          order.voucher!.discount.id
        )
        }
  
        await Promise.all(
          promoItems.map(item =>
            this.discountService.addDiscountUsage(
              manager,
              payload.userRoleId,
              item.product.promo!.discount.id
            )
          )
        )
        await this.reduceStock(manager,cart)
        await this.clearCart(manager,cart)
        return saveOrder
      }
    )
  }

  async findAll(
    payload:Payload,
    dto:FindOrderDto
  ) {
    let where: FindOptionsWhere<Order> = {}
    if(dto.order_status){
      where.status = dto.order_status
    }
    this.addRole(where,payload.role,payload.userRoleId)
    return await this.orderRepository.find({
      where,
      cache:true,
      order:{
        id:'DESC'
      },
      relations:{
        orderAddress:true,
        store:true,
        orderItems:{
          product:{
            category:true,
            images:true,
            
          },
          types:{
            orderProductTypeItems:{
              item:true
            },
            type:true
          }
        },
      }
    })
  }

  async findOne(id: number,payload:Payload) {
    let where: FindOptionsWhere<Order> = {}
    where.id = id
    this.addRole(where,payload.role,payload.userRoleId)
    const order = await this.orderRepository.findOne({
      cache:true,
      where:where,
      relations:{
        orderAddress:true,
        store:true,
        orderItems:{
          product:{
            category:true,
            images:true,
          },
          types:{
            orderProductTypeItems:{
              item:true
            },
            type:true
          }
        },
      }
    })
    return order;
  }

  private addRole(where:FindOptionsWhere<Order>, userRole:UserRole, id:number){
    if(userRole == UserRole.BUYER){
      where.buyer = {
        id
      }
    }else{
      where.store = {
        seller:{
          id
        }
      }
    }
  }

  private async buildOrder(
    payload: Payload,
    dto: PreviewOrderDto,
    cart: Cart,
    statusOrder: OrderStatus | undefined = OrderStatus.PROCCESS,
  ): Promise<Order> {
    const address = await this.addressRepository.findOneBy({
      id: dto.address_id,
      buyer:{
        id:payload.userRoleId
      }
    })

    if (!address) {
      throw new NotFoundException(
        exceptionMessage(ExceptionType.NOT_FOUND, 'Address')
      )
    }

    const store = await this.storeRepository.findOne({
      where:{
        id: cart.store_id!
      },
      relations:{
        seller:true
      }
    })

    if (!store) {
      throw new NotFoundException(
        exceptionMessage(ExceptionType.NOT_FOUND, 'Store')
      )
    }

    const distance = this.deliveryService.calculateDistance(
      store.latitude!,
      store.longitude!,
      address.latitude!,
      address.longitude!
    )
    let voucherPrice: number | undefined = undefined
    let voucher : Voucher | undefined = undefined

    const subTotal = await this.calculateCartTotal(cart.cartItems,payload.userRoleId)

    if(dto.voucher_code){
      voucher = await this.voucherService.validateVoucherCode(dto.voucher_code, payload.userRoleId)
      voucherPrice = (voucher.discount.discount_percantage / 100) * subTotal
    }

    const deliveryPrice = deliveryFee(
      dto.delivery_method,
      distance.distanceKm
    )

    const taxFee = this.ppnCalculation(subTotal)
    const totalFee =
      subTotal +
      deliveryPrice +
      taxFee - (voucherPrice ?? 0)
  
    const orderData = mapToOrder(
      payload,
      cart,
      store,
      address,
      dto.delivery_method,
      deliveryPrice,
      Math.ceil(distance.distanceKm),
      subTotal,
      taxFee,
      totalFee,
      statusOrder,
      await this.overdue(dto.delivery_method),
      voucher,
      voucherPrice
  )

  return this.orderRepository.create(orderData)
  }

  private async validatePromoItem(cart:Cart,buyerId:number){
    await Promise.all(
      cart.cartItems.map( async item => {
        const promo = item.product.promo

        if(!promo){
          return
        }
      const canUsePromo = await this.discountService.validatePromoUsage(buyerId,promo.discount.id)
      if (!canUsePromo) {
          item.product.promo = null as any
        }
      })
    )
    return cart
  }

  async update(id: number, payload:Payload,updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where :{
        id,
        store:{
          seller:{
            id:payload.userRoleId
          }
        }
      },
    })
    if(!order){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Order"))
    }
    order.status = updateOrderDto.order_status
    await this.orderRepository.save(order)
    await this.orderHistoryRepository.save({
      status_order: updateOrderDto.order_status,
      order: {
        id: order.id
      }
    })
    
    return true;
  }

  private async calculateDiscount(item:CartItem,buyerId:number):Promise<number>{
    const promo = item.product.promo

    if(!promo){
      return 0
    }

    const canUsePromo = await this.discountService.validatePromoUsage(buyerId,promo.discount.id)

    if(!canUsePromo){
      return 0
    }

    const discountPercantage = promo.discount.discount_percantage / 100
    return (item.product.price * discountPercantage)
  }

  private async calculateCartItemSubtotal(
    item:CartItem,
    buyerId:number,
  ):Promise<number>{
    const extraPrice = item.cartProductTypes
    .flatMap(type =>type.cartProductTypeItems)
    .reduce(
      (sum,item) => sum + item.productTypeItem.price,
      0
    )
    const discount = await this.calculateDiscount(item,buyerId)
    return (
      (
        item.product.price - discount + extraPrice
      ) * item.quantity
    )
  }

  private async calculateCartTotal(cartItems:CartItem[],buyerId:number){
    const subTotals = await Promise.all(
      cartItems.map(item => 
        this.calculateCartItemSubtotal(
          item,
          buyerId
        )
      )
    )
    const subTotal = subTotals.reduce(
      (sum,value) => sum + value,
      0
    )
    return subTotal
  }
}
