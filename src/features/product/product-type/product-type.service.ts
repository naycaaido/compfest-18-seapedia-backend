import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { Repository } from 'typeorm';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Payload } from 'src/common/utils';
import { log } from 'console';
import { mapToProductTypeFromProduct} from '../mapper/product.mapper';
import { ProductService } from '../product/product.service';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository:Repository<ProductType>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService :ProductService
    
  ) {}

  private static readonly relation:string[] = [
    'items'
  ]
  private static readonly relationIds:object = {
    relations: ['product']
  }

  async create(createProductTypeDto: CreateProductTypeDto,payload:Payload) {
    const exist = await this.productService.existBySeller(payload.userRoleId,[createProductTypeDto.product_id])
    this.checkExist(exist)
    
    const newProductType = mapToProductTypeFromProduct(createProductTypeDto)
    await this.productTypeRepository.save(newProductType)
  }

  async findAll(productId:number,payload:Payload) {
    this.checkNumber(productId)
    return await this.productTypeRepository.find({
      where:{
        product:{
          id:productId,
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
      },
      loadRelationIds : ProductTypeService.relationIds,
      relations:ProductTypeService.relation
    });
  }

  async findOne(id: number,payload:Payload) {
    this.checkNumber(id)

    return await this.productTypeRepository.find({
      where:{
        id:id,
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
      },
      loadRelationIds : ProductTypeService.relationIds,
      relations:ProductTypeService.relation
    });
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto,payload:Payload) {
    this.checkNumber(id)
    const exist = await this.productTypeRepository.existsBy({
        id,
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
    })
    this.checkExist(exist)
    const updatedProduct = this.productTypeRepository.create({
      ...updateProductTypeDto,
      id,
      product:{
        id:updateProductTypeDto.product_id
      }
    })
    
    return await this.productTypeRepository.save(updatedProduct)
  }

  async remove(id: number,payload:Payload) {
    this.checkNumber(id)
    const exist = await this.productTypeRepository.existsBy({
      id,
      product:{
        store:{
          seller:{
            id:payload.userRoleId
          }
        }
      }
    })
    this.checkExist(exist)

    await this.productTypeRepository.softDelete({
      id,
    })
    return true;
  }

  async existByProductItemTypeId(id:number,sellerId:number){
    return await this.productTypeRepository.existsBy({
      id,
      product:{
        store:{
          seller:{
            id:sellerId
          }
        }
      }
    })
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
