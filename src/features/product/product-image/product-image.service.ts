import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { DataSource, In, Repository } from 'typeorm';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { File } from 'src/features/image/constant';
import { DirType, Payload } from 'src/common/utils';
import { ImageService } from 'src/features/image/image.service';
import path from 'path';
import { RemoveProductImageDto } from './dto/create-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepository:Repository<ProductImage>,
    private imageService:ImageService,
    private dataSource:DataSource
  ) {}

  async findAll(productId:number) {
    if (isNaN(productId)) {
      throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'product_id must be a number,'));
    }
    const productImages = await this.productImageRepository.findBy({
      product:{
        id:productId
      }
    })
    return productImages;
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'product_id must be a number,'));
    }
    const productImages = await this.productImageRepository.findOneBy({
      id:id
    })
    return productImages;
  }

  async remove(dto:RemoveProductImageDto,payload:Payload) {
    const productImages = await this.productImageRepository.findBy({
        id:In(dto.product_image_ids),
        product:{
          store:{
            seller:{
              id:payload.userRoleId
            }
          }
        }
    })
    if (productImages.length !== dto.product_image_ids.length){
      throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'One or more images do not belong to this seller,'))
    }
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      await queryRunner.manager.delete(ProductImage,{
        id:In(dto.product_image_ids)
      })
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
    await Promise.all(
        productImages.map((img) => this.imageService.removeImage(img.image_id!))
    )
    return productImages
  }

  async create(productId:number,files:File[],payload:Payload) {
    const product = await this.productImageRepository.findOneBy({
      product:{
        id:productId,
        store:{
          seller:{
            id:payload.userRoleId
          }
        }
      }
    })
    if (!product){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product Image'))
    }
    if(files.length < 0){
      throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Files cannot be empty,'))
    }
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const newFiles = files?.map(file => this.imageService.makeFileName(file.fileName)) ?? [];
    try {
      const productsImages = newFiles.map((file) => this.productImageRepository.create({
        product:{
          id:productId
        },
        image_id:`${DirType.PRODUCT}/${file}`
      }))
      
      await queryRunner.manager.save(productsImages)
      await Promise.all(
        files.map((file,index) => this.imageService.writeImage(file,newFiles[index],DirType.PRODUCT))
      )
      await queryRunner.commitTransaction()
      return productsImages
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await Promise.all(
        newFiles.map(file => this.imageService.removeImage(file).catch(() => {}))
      )
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
