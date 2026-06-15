import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { log } from 'console';
import { File } from 'src/features/image/constant';
import { DirType, Payload } from 'src/common/utils';
import { SellerService } from 'src/features/seller/seller.service';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Store } from 'src/features/store/entities/store.entity';
import { ImageService } from 'src/features/image/image.service';
import { FindProductDto } from './dto/find-product.dto';
import { mapToProduct, mapToProductMerge, mapToProductTypesFromProduct } from '../mapper/product.mapper';
import { ProductType } from '../product-type/entities/product-type.entity';
import { ProductTypeService } from '../product-type/product-type.service';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { StoreService } from 'src/features/store/store.service';
import path from 'path';
import { types } from 'util';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly sellerService:SellerService,
    private readonly imageService:ImageService,
    private readonly productTypeService:ProductTypeService,
    private readonly storeService:StoreService,
    private readonly dataSource:DataSource
    
  ) {
    
  }
  async create(createProductDto: CreateProductDto,files:File[],payload:Payload) {
    // Experiment Transactions
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    const newFiles = files?.map(file => this.imageService.makeFileName(file.fileName)) ?? [];

    try {
      const seller = await this.sellerService.findOne(payload.userRoleId)
      
      if(!seller){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Seller'))
      }
      const store = await this.storeService.findBySellerId(seller?.id)
      if (!store) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Store'));
      }
      const storeId = store.id
      const product = this.productRepository.create({
        ...mapToProduct(createProductDto),
        store: {
          id: storeId,
        },
        images: (newFiles ?? []).map(imageId => ({
          image_id:path.join(DirType.PRODUCT,imageId)
        })),
      })
      log(product)
      await queryRunner.manager.save(product)

      // Write File before commit
      if (newFiles.length > 0){
        await Promise.all(
          files.map((file,index) =>
            this.imageService.writeImage(file,newFiles[index],DirType.PRODUCT)
          )
        )
      }
      await queryRunner.commitTransaction()
      return product
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await Promise.all(
        newFiles.map(file =>
          this.imageService.removeImage(file).catch(() => {})
        )
      )
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findProductDto:FindProductDto) {
    let where:FindOptionsWhere<Product> = {}
    if (findProductDto.store_id){
      where.store = {
        id:findProductDto.store_id
      }
    }

    if (findProductDto.name){
      where.name = ILike(`%${findProductDto.name}%`)
    }
    return await this.productRepository.find({
      where:where,
      cache:true,
      relations:[
        'images',
        'types.items',
        'store'
      ]
    });
  }

  async findOne(id: number) {
     return await this.productRepository.find({
      cache:true,
      where:{
        id
      },
      relations:[
        'images',
        'types.items',
        'store'
      ]
    });
  }

  async update(id:number,updateProductDto: UpdateProductDto,payload:Payload) {
    const product = await this.productRepository.findOne({
      where:{
        id,
        store:{
          seller:{
            id:payload.userRoleId
          }
        }
      },
      relations:[
        'images',
        'types.items',
        'store'
      ]
    })
    if(!product){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product'))
    }
    
    const updatedProduct = this.productRepository.merge(
      product,
      mapToProductMerge(updateProductDto),
    )
    if(updateProductDto.types){
      if(product.types.length > 0){
        await this.productTypeService.removeByProductId(product.id)
      }
      updatedProduct.types = mapToProductTypesFromProduct(updateProductDto) as ProductType[]
    }
    await this.productRepository.save(updatedProduct)
  }

  async remove(id: number,payload:Payload) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        store: {
          seller: {
            id: payload.userRoleId,
          },
        },
      },
    });
    if (!product) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Product'),
      );
    }
    const result = await this.productRepository.softDelete({
      id:product.id
    })

    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }

  async permanentDelete(id: number,payload:Payload) {
    const condition = payload.role == UserRole.ADMIN
    const tempRoleId = condition ? undefined : payload.userRoleId
    const product = await this.productRepository.findOne({
      where:{
        id:id,
        store:{
          seller:{
            id:tempRoleId
          }
        }
      },
      relations:[
        'images'
      ],
      withDeleted:true
    })
    if (!product) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Product'),
      );
    }
        
    const result = await this.productRepository.delete({id:product?.id})
    if (product.images?.length > 0){
      await Promise.all( product.images.map((image) =>
        this.imageService.removeImage(image.image_id!)
      ) 
      )
    }
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }
}
