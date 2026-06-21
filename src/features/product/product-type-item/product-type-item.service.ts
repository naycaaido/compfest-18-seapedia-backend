import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductTypeItemDto } from './dto/create-product-type-item.dto';
import { UpdateProductTypeItemDto } from './dto/update-product-type-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTypeItem } from './entities/product-type-item.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Payload } from 'src/common/utils';
import { log } from 'console';
import { ProductTypeService } from '../product-type/product-type.service';

@Injectable()
export class ProductTypeItemService {
  constructor(
    @InjectRepository(ProductTypeItem)
    private productTypeItemRepository:Repository<ProductTypeItem>,
    private readonly productTypeService: ProductTypeService
  ) {
    
  }

  async create(createProductTypeItemDto: CreateProductTypeItemDto,payload:Payload) {
    const exist = await this.productTypeService.existByProductItemTypeId(createProductTypeItemDto.product_type_id,payload.userRoleId)
    this.checkExist(exist)

    const productTypeItem = this.productTypeItemRepository.create({
      ...createProductTypeItemDto,
      type:
        {
          id:createProductTypeItemDto.product_type_id
        }
    })
    return await this.productTypeItemRepository.save(productTypeItem);
  }

  async findAll(id:number,payload:Payload) {
    this.checkNumber(id)
    return await this.productTypeItemRepository.findBy({
      type:{
        id,
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
      }
    })
  }

  async update(id: number, updateProductTypeItemDto: UpdateProductTypeItemDto,payload:Payload) {
    this.checkNumber(id)
    const existProductTypeItem = await this.productTypeItemRepository.existsBy({
      id,
      type:{
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
      }
    })
    this.checkExist(existProductTypeItem)

    if(updateProductTypeItemDto.product_type_id){
      const existProductType = await this.productTypeService.existByProductItemTypeId(updateProductTypeItemDto.product_type_id,payload.userRoleId)
      this.checkExist(existProductType)
    }

    const productTypeItem = this.productTypeItemRepository.create({
      id,
      ...updateProductTypeItemDto,
      type:
        {
          id:updateProductTypeItemDto.product_type_id
        }
    })
    return await this.productTypeItemRepository.save(productTypeItem);
  }

  async remove(id: number,payload:Payload) {
    this.checkNumber(id)
    const exist = await this.productTypeItemRepository.existsBy({
      id,
      type:{
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
      }
    })
    this.checkExist(exist)

    await this.productTypeItemRepository.softDelete({
      id,
    })
    return true;
  }

  async findBy(value: number[]){
    return await this.productTypeItemRepository.findBy({
      id:In(value)
    })
  }

  private checkNumber(num:number){
      if(isNaN(num)){
        throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Id is not recognizable'))
      }
  }
  
  private checkExist(exist:boolean){
      if (!exist){
        throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'Access Product Id')); 
      }
  }
}
