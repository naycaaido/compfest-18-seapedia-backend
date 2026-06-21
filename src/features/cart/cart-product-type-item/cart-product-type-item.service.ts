import { Injectable } from '@nestjs/common';
import { CreateCartProductTypeItemDto } from './dto/create-cart-product-type-item.dto';
import { UpdateCartProductTypeItemDto } from './dto/update-cart-product-type-item.dto';

@Injectable()
export class CartProductTypeItemService {
  create(createCartProductTypeItemDto: CreateCartProductTypeItemDto) {
    return 'This action adds a new cartProductTypeItem';
  }

  findAll() {
    return `This action returns all cartProductTypeItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartProductTypeItem`;
  }

  update(id: number, updateCartProductTypeItemDto: UpdateCartProductTypeItemDto) {
    return `This action updates a #${id} cartProductTypeItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartProductTypeItem`;
  }
}
