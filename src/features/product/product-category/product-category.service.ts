import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { In, Repository } from 'typeorm';
import { log } from 'console';
import { Payload } from 'src/common/utils';
import { ProductService } from '../product/product.service';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { UpdateProductCategoriesDto } from './dto/update-product-categories.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository:Repository<ProductCategory>,
    @Inject(forwardRef(() => ProductService))
    private productService:ProductService
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto,payload:Payload) {
    const condition = Array.isArray(createProductCategoryDto.product_ids) && createProductCategoryDto.product_ids.length > 0 
    if (condition){
      const existAll = await this.productService.existBySeller(payload.userRoleId,createProductCategoryDto.product_ids)
      if (!existAll){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Access product id'));
      }
    }

    const productCategory = this.productCategoryRepository.create({
      products: condition ? createProductCategoryDto.product_ids.map(productId => ({
        id:productId
      })) : undefined,
      seller:{
        id:payload.userRoleId
      },
      name:createProductCategoryDto.name,
    })
    
    const productCategories = await this.productCategoryRepository.save(productCategory)
    return productCategories;
  }

  
  async findAll(payload:Payload) {
    return await this.productCategoryRepository.find({
      where:{
        seller:{
          id:payload.userRoleId
        }
      },
      loadRelationIds:true
    });
  }

  async findOneBySellerId(sellerId:number,id:number){
    return await this.productCategoryRepository.exists({
        where:{
          id,
          seller:{
            id:sellerId
          }
        }
    });
  }

  async findOne(id: number,payload:Payload) {
    if(isNaN(id)){
      throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Id is not recognizable'))
    }
    return await this.productCategoryRepository.findOneBy({
      id,
      seller:{
        id:payload.userRoleId
      }
    });
  }

  async update(id: number, updateProductCategoriesDto: UpdateProductCategoriesDto,payload:Payload) {
    // Experiment exist
    // Update by Id
    const condition = Array.isArray(updateProductCategoriesDto.product_ids) && updateProductCategoriesDto.product_ids.length > 0 
    if (condition){
      const existAll = await this.productService.existBySeller(payload.userRoleId,updateProductCategoriesDto.product_ids!)
      if (!existAll){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Access product id'));
      }
    }

    const productCategory = await this.productCategoryRepository.findOne({
      where:{
        id,
        seller:{
          id:payload.userRoleId
        }
      }
    })

    if(!productCategory){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product category'))
    }
    await this.productCategoryRepository.update(
      productCategory.id,
      {
        name:updateProductCategoriesDto.name
      }
    )
    if(condition){
      await this.productService.updateCategoriesId(productCategory.id,updateProductCategoriesDto)
    }

    return true;
  }

  async remove(id: number,payload:Payload) {
    // Experiment
    const productCategory = await this.findOne(id,payload)
    if(!productCategory){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product category'))
    }
    await this.productCategoryRepository.softDelete({
      id
    })
    return true;
  }
}
