import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { Repository } from 'typeorm';
import { exceptionMessage, ExceptionType } from 'src/common/exception';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository:Repository<ProductType>
  ) {}

  create(createProductTypeDto: CreateProductTypeDto) {
    return 'This action adds a new productType';
  }

  findAll() {
    return `This action returns all productType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productType`;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productType`;
  }

  async removeByProductId(productId:number){
    const result = await this.productTypeRepository.delete({
      product:{
        id:productId
      }
    })
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }
}
