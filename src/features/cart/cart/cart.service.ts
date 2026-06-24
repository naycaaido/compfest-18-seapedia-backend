import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/common/utils';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from '../cart-item/dto/create-cart-item.dto';
import { CartItemService } from '../cart-item/cart-item.service';
import { UpdateCartItemDto } from '../cart-item/dto/update-cart-item.dto';
import { Store } from 'src/features/store/entities/store.entity';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Product } from 'src/features/product/product/entities/product.entity';
import { Buyer } from 'src/features/buyer/entities/buyer.entity';
import { log } from 'console';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { SystemService } from 'src/features/system/system.service';
import { DiscountService } from 'src/features/discount/discount/discount.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository : Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository : Repository<CartItem>,
    private readonly cartItemService:CartItemService,
    private readonly discountService:DiscountService,
    private readonly systemService:SystemService,
  ) {}

  async findCart(payload:Payload) {
    const cart  = await this.cartRepository.findOne({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:[
        "cartItems.product.images",
        "cartItems.product.promo.discount",
        "cartItems.cartProductTypes.productType",
        "cartItems.cartProductTypes.cartProductTypeItems.productTypeItem",
      ]
    })

    if(!cart){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Cart'))
    }

    const cartItems = await Promise.all(
        cart.cartItems.map(async item => ({
        ...item,
        sub_total: await this.calculateCartItemSubtotal(item,payload),
      }))
    )

    const subTotal = cartItems.reduce(
      (sum, item) => sum + item.sub_total,
      0,
    )
    return {
      ...cart,
      cartItems,
      sub_total: subTotal,
    }
  }

  async create(createCartDto: CreateCartItemDto,payload:Payload) {
    const cart = await this.cartRepository.findOneOrFail({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        buyer:true
      }
    })
    const activeAddressIsNull = cart.buyer.active_address_id == null
    const phoneNumberIsNull = cart.buyer.phone_number == null
    if(activeAddressIsNull || phoneNumberIsNull){
      log(cart.buyer.phone_number)
      const message = `${activeAddressIsNull ? "Buyer must at least have one address, " :""}${phoneNumberIsNull ? "Buyer must have phone number" :""}`
      throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,message))
    }
    const result = await this.cartItemService.create(createCartDto,cart,payload)
    if(cart.store_id === null){
      cart.store_id = result.storeId
      await this.cartRepository.save(cart)
    }
    return result.cartItem
  }

  async update(id: number, updateCartDto: UpdateCartItemDto,payload:Payload) {
    const cartItem = await this.cartItemService.update(id,updateCartDto,payload.userRoleId)
    return cartItem
  }

  private async calculateCartItemSubtotal(cartItem: CartItem,payload:Payload): Promise<number> {
    const extraPrice = cartItem.cartProductTypes
      .flatMap(type => type.cartProductTypeItems)
      .reduce(
        (sum, item) => sum + item.productTypeItem.price,
        0,
      )

      
    const discount = await this.promoPrice(cartItem.product,payload)

    return (
      (
        cartItem.product.price -
        discount +
        extraPrice
      ) * cartItem.quantity
    )
  }

  private async promoPrice(product: Product,payload:Payload): Promise<number> {
    const promo = product.promo
    if (!promo) {
      return 0
    }
    const canUsePromo = await this.discountService.validatePromoUsage(
        payload.userRoleId,
        promo.discount.id,
      )

    if (!canUsePromo) {
      return 0
    }
    const discountPercantage = promo.discount.discount_percantage

    return (
      product.price *
      discountPercantage /
      100
    )
  }

  async remove(id: number,payload:Payload) {
    await this.cartItemService.remove(id,payload)
    const cart = await this.cartRepository.findOneBy({
    buyer: {
      id: payload.userRoleId
      }
    })

    if (cart) {
      const count = await this.cartItemRepository.count({
        where: {
          cart: {
            id: cart.id
          }
        }
      })

      if (count === 0) {
        cart.store_id = null
        await this.cartRepository.save(cart)
      }
    }

    return true
  }

  async removeAll(payload:Payload) {
    const cart = await this.cartRepository.findOneBy({
      buyer:{
        id:payload.userRoleId
      }
    })
    if(!cart){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Cart"))
    }
    await this.cartItemService.removeByCartId(cart.id)
    cart.sub_total = 0
    cart.store_id = null
    await this.cartRepository.save(cart)
    return true
  }

}
