import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from './entities/order-history.entity';
import { Order } from './entities/order.entity';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { UserRole } from '../user/entities/role_user.enum';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Cart } from '../cart/cart/entities/cart.entity';
import { log } from 'console';
import { DeliveryService } from './delivery/delivery.service';
import { Address } from '../address/entities/address.entity';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { Store } from '../store/entities/store.entity';
import { deliveryFee, DeliveryMethod } from './entities/delivery-method.enum';
import { Buyer } from '../buyer/entities/buyer.entity';
import { SystemService } from '../system/system.service';
import { mapToOrder } from './mapper/order.mapper';
import { Product } from '../product/product/entities/product.entity';
import { ProductTypeItem } from '../product/product-type-item/entities/product-type-item.entity';
import { CartItem } from '../cart/cart-item/entities/cart-item.entity';
import { Wallet } from '../wallet/wallet/entities/wallet.entity';
import { WalletTransactions } from '../wallet/wallet-transaction/entities/wallet-transaction.entity';
import { WalletTransactionType } from '../wallet/wallet-transaction/entities/wallet-transaction-type.enum';
import { OrderStatus } from './entities/order-status.enum';
import { FindOrderDto } from './dto/find-order.dto';

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
    private dataSource:DataSource
  ) {
    
  }

  async preview(payload:Payload,dto:PreviewOrderDto) {
    const cart = await this.cartRepository.findOne({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        cartItems:{
          product:true,
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

  private async processPayment(
    manager:EntityManager,
    wallet:Wallet,
    order:Order,
    userId:number,
    sellerId:number
  ){
    if(wallet.balance < order.total_fee){
      throw new BadRequestException(
        exceptionMessage(ExceptionType.BAD_REQUEST,"Insufficient Balance")
      )
    }

    await manager.decrement(
      Wallet,
      {
        id:wallet.id
      },
      "balance",
      order.total_fee
    )
    await manager.save(
      WalletTransactions,{
        type:WalletTransactionType.PAYMENT,
        amount:order.total_fee,
        description:`Payment Order #${order.id}`,
        receiver:{
          id:sellerId
        },
        sender:{
          id:userId
        }
      }
    )
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
        const cart = await manager.findOne(
          Cart,
          {
            where:{
              buyer:{
                id:payload.userRoleId
              }
            },
            relations:{
              cartItems:{
                product:true,
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

        await this.validationStock(cart,manager)
        const order = await this.buildOrder(
          payload,
          dto,
          cart,
          OrderStatus.PROCCESS
        )
        const saveOrder = await manager.save(order)
      
        await this.processPayment(manager,wallet,saveOrder,payload.sub,order.store.seller.id)
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

  async findAllHistory(id:number,payload:Payload){
    let where: FindOptionsWhere<Order> = {}
    this.addRole(where,payload.role,payload.userRoleId)
    where.id = id
    const order = await this.orderRepository.findOneBy(where)
    if (!order){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Order"))
    }
    return await this.orderHistoryRepository.find({
      where: {
        order: {
          id
        }
      },
      order: {
        createdAt: 'DESC'
      }
    })
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
    statusOrder: OrderStatus | undefined = OrderStatus.PROCCESS
  ): Promise<Order> {
    const address = await this.addressRepository.findOneBy({
      id: dto.address_id
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

    const distance = await this.deliveryService.calculateDistance(
      store.latitude!,
      store.longitude!,
      address.latitude!,
      address.longitude!
    )

    const subTotal = cart.cartItems.reduce(
      (sum, item) => sum + item.sub_total,
      0
    )

    const deliveryPrice = deliveryFee(
      dto.delivery_method,
      distance.distanceKm
    )
    const taxFee = this.ppnCalculation(subTotal)
    const totalFee =
      subTotal +
      deliveryPrice +
      taxFee

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
    await this.overdue(dto.delivery_method)
  )

  return this.orderRepository.create(orderData)
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
}
