import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/common/utils';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from '../cart-item/dto/create-cart-item.dto';
import { CartItemService } from '../cart-item/cart-item.service';
import { UpdateCartItemDto } from '../cart-item/dto/update-cart-item.dto';

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
    })
    const cartItem = await this.cartItemService.create(createCartDto,cart)
    await this.recalculateSubtotal(payload.userRoleId)
    return cartItem
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

    await this.cartRepository.save(cart)
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
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
}
