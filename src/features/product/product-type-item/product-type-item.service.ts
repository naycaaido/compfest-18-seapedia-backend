import { Injectable } from '@nestjs/common';
import { CreateProductTypeItemDto } from './dto/create-product-type-item.dto';
import { UpdateProductTypeItemDto } from './dto/update-product-type-item.dto';

@Injectable()
export class ProductTypeItemService {
  create(createProductTypeItemDto: CreateProductTypeItemDto) {
    return 'This action adds a new productTypeItem';
  }

  findAll() {
    return `This action returns all productTypeItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productTypeItem`;
  }

  update(id: number, updateProductTypeItemDto: UpdateProductTypeItemDto) {
    return `This action updates a #${id} productTypeItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} productTypeItem`;
  }
}
