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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository : Repository<Cart>,
    private readonly cartItemService:CartItemService
  ) {}

  async findCart(payload:Payload) {
    return await this.cartRepository.findOne({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:[
        "cartItems.product.images",
        "cartItems.cartProductTypes.productType",
        "cartItems.cartProductTypes.cartProductTypeItems.productTypeItem",
      ]
    })
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
    const result = await this.cartItemService.create(createCartDto,cart)
    if(cart.store_id === null){
      cart.store_id = result.storeId
      await this.cartRepository.save(cart)
    }
    await this.recalculateSubtotal(payload.userRoleId)
    return result.cartItem
  }

  async recalculateSubtotal(buyerId: number) {
    const cart = await this.cartRepository.findOneOrFail({
      where: { 
        buyer:{
          id:buyerId
        }
       },
      relations: {
        cartItems: true
      }
    })

    cart.sub_total = cart.cartItems.reduce(
      (sum, item) => sum + item.sub_total,
      0
    ) 
    if(cart.cartItems.length === 0){
      cart.store_id = null
    }
    await this.cartRepository.save(cart)
  }

  async update(id: number, updateCartDto: UpdateCartItemDto,payload:Payload) {
    const cartItem = await this.cartItemService.update(id,updateCartDto,payload.userRoleId)
    await this.recalculateSubtotal(payload.userRoleId)
    return cartItem
  }

  async remove(id: number,payload:Payload) {
    await this.cartItemService.remove(id,payload)
    await this.recalculateSubtotal(payload.userRoleId)
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
