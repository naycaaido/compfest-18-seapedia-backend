import { Injectable } from '@nestjs/common';
import { CreateCartProductTypeDto } from './dto/create-cart-product-type.dto';
import { UpdateCartProductTypeDto } from './dto/update-cart-product-type.dto';

@Injectable()
export class CartProductTypeService {
  create(createCartProductTypeDto: CreateCartProductTypeDto) {
    return 'This action adds a new cartProductType';
  }

  findAll() {
    return `This action returns all cartProductType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartProductType`;
  }

  update(id: number, updateCartProductTypeDto: UpdateCartProductTypeDto) {
    return `This action updates a #${id} cartProductType`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartProductType`;
  }
}
