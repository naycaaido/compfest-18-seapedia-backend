import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { In, Repository } from 'typeorm';
import { mapToCartItem } from '../mapper/cart.mapper';
import { log } from 'console';
import { ProductService } from 'src/features/product/product/product.service';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { ProductTypeItemService } from 'src/features/product/product-type-item/product-type-item.service';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from 'src/features/product/product/entities/product.entity';
import { ProductTypeItem } from 'src/features/product/product-type-item/entities/product-type-item.entity';
import { Payload } from 'src/common/utils';
import { CartProductType } from '../cart-product-type/entities/cart-product-type.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository : Repository<CartItem>,
    @InjectRepository(CartProductType)
    private cartProductTypeRepository : Repository<CartProductType>,
    private readonly productService:ProductService,
    private readonly productTypeItemService:ProductTypeItemService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto,cart:Cart,payload:Payload) {
    const product = await this.productService.findOne(createCartItemDto.product_id,false,{store:true},undefined,payload)
    if(!product){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product'))
    }

    if(cart.store_id !== null &&
       cart.store_id !== product.store.id){
      throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'Product must be from the same store,'))
    }

    const selectedItemIds = createCartItemDto.types.flatMap(type =>
      type.items.map(item => item.product_type_item_id)
    )
    const productTypeItems = await this.productTypeItemService.findBy(selectedItemIds)

    const existing = await this.existing(createCartItemDto,cart.id,product,productTypeItems)
    if(existing){
      return {
        cartItem:existing,
        storeId:product.store.id
      }
    }
    
    const extraPrice = this.extraPrice(productTypeItems)
    const cartItem = this.cartItemRepository.create(
      mapToCartItem(createCartItemDto, cart.id)
    )
    cartItem.sub_total = (product.price + extraPrice) * cartItem.quantity!

    return {
      cartItem: await this.cartItemRepository.save(cartItem),
      storeId:product.store.id
    }
  }

  async existing(dto:CreateCartItemDto,cartId:number,product:Product,productTypeItems:ProductTypeItem[]){
    const cartItems = await this.findAll(dto,cartId)
    const dtoItemIds = dto.types
      .flatMap(type => type.items)
      .map(item => item.product_type_item_id)
      .sort((a, b) => a - b)

    const existingCartItem = cartItems.find(cartItem => {
      const cartItemIds = cartItem.cartProductTypes
      .flatMap(type => type.cartProductTypeItems)
      .map(item => item.productTypeItem.id)
      .sort((a,b) => a-b)
          return(
            cartItemIds.length === dtoItemIds.length && 
            cartItemIds.every((id,index) => id === dtoItemIds[index])
      )
    })

    if(existingCartItem){
      existingCartItem.quantity += dto.quantity
      const extraPrice = this.extraPrice(productTypeItems)
      existingCartItem.sub_total = (product.price + extraPrice) * existingCartItem.quantity
      await this.cartItemRepository.save(existingCartItem)
      return existingCartItem
    }
  }

  private extraPrice(productTypeItems:ProductTypeItem[]){
    return productTypeItems.reduce((sum,item) => sum + item.price,0)
  }

  async findAll(dto:CreateCartItemDto,cartId:number) {
    const cartItems = await this.cartItemRepository.find({
      where: {
        cart: {
          id:cartId
        },
        product: {
          id: dto.product_id
        }
      },
      relations: {
        cartProductTypes: {
          cartProductTypeItems: {
            productTypeItem: true
          }
        }
      }
    })
    return cartItems;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  async update(
    id: number,
    dto: UpdateCartItemDto,
    buyerId: number
  ) {
    const cartItem = await this.cartItemRepository.findOneOrFail({
      where: {
        id,
        cart: {
          buyer: {
            id: buyerId
          }
        }
      },
      relations: {
        product: true,
        cartProductTypes: {
          cartProductTypeItems: {
            productTypeItem: true
          }
        }
      }
    })

    if (dto.quantity !== undefined) {
      cartItem.quantity = dto.quantity
    }

    let extraPrice = 0

    if (dto.types) {
      await this.cartProductTypeRepository.delete({
        cartItem: {
          id: cartItem.id
        }
      })

      cartItem.cartProductTypes = dto.types.map(type => ({
        productType: {
          id: type.product_type_id
        },
        cartItem: {
          id: cartItem.id
        },  
        cartProductTypeItems: type.items.map(item => ({
          productTypeItem: {
            id: item.product_type_item_id
          }
        }))
      })) as CartProductType[]

      const selectedItemIds = dto.types.flatMap(type =>
        type.items.map(item => item.product_type_item_id)
      )

      const productTypeItems = await this.productTypeItemService.findBy(selectedItemIds)

      extraPrice = this.extraPrice(productTypeItems)
      } else {
        const productTypeItems = cartItem.cartProductTypes.flatMap(
          type => type.cartProductTypeItems.map(
            item => item.productTypeItem
          )
        )

        extraPrice = this.extraPrice(productTypeItems)
      }

      cartItem.sub_total =
      (cartItem.product.price + extraPrice) *
      cartItem.quantity

    return await this.cartItemRepository.save(cartItem)
  }

  async removeByCartId(cartId:number){
    await this.cartItemRepository.delete({
      cart:{
        id:cartId
      }
    })
  }

  async remove(id: number,payload:Payload) {
    const cartItem = await this.cartItemRepository.findOneBy({
      id,
      cart:{
        buyer:{
          id:payload.userRoleId
        }
      }
    })
    if (!cartItem) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Cart item'),
      );
    }
    const result = await this.cartItemRepository.delete({
      id
    })
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }
}
