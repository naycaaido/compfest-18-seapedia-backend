import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, FindOptionsWhere, ILike, In, Repository } from 'typeorm';
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
import { ProductCategoryService } from '../product-category/product-category.service';
import { UpdateProductCategoriesDto } from '../product-category/dto/update-product-categories.dto';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly sellerService:SellerService,
    private readonly imageService:ImageService,
    @Inject(forwardRef(() => ProductTypeService))
    private readonly productTypeService:ProductTypeService,
    private readonly storeService:StoreService,
    @Inject(forwardRef(() => ProductCategoryService))
    private readonly productCategoryService:ProductCategoryService,
    private readonly dataSource:DataSource
    
  ) {}

  private static readonly productRelation = [
      'images',
      'types.items',
      'store',
      'category'
  ];

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
      if(createProductDto.category_id){
        const isExist = await this.productCategoryService.findOneBySellerId(payload.userRoleId,createProductDto.category_id)

        if (!isExist){
          throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'Category Id is'))
        }
      }
      const product = this.productRepository.create({
        ...mapToProduct(createProductDto),
        store: {
          id: storeId,
        },
        images: (newFiles ?? []).map(imageId => ({
          image_id:path.join(DirType.PRODUCT,imageId)
        })),
      })
      
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
      take:findProductDto.limit,
      relations:ProductService.productRelation
    });
  }

  async findOne(id: number, relations:boolean = true,seller?:object) {
     return await this.productRepository.find({
      cache:true,
      where:{
        id,
        store:{
          seller:seller
        }
      },
      relations:relations ? ProductService.productRelation : undefined
    });
  }

  async existBySeller(sellerId:number,productIds:number[]){
    const count = await this.productRepository.countBy({
      id:In(productIds),
      store:{
        seller:{
          id:sellerId
        }
      }
    })
    return count == productIds.length
  }

  async updateCategoriesId(categoryId:number,updateProductCategoriesDto : UpdateProductCategoriesDto){
    await this.productRepository.update(
      {
        id:In(updateProductCategoriesDto.product_ids!)
      },
      {
        category:{
          id:categoryId
        }
      }
    )
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
      relations:ProductService.productRelation
    })
    if(!product){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Product'))
    }
    if(updateProductDto.category_id){
        const isExist = await this.productCategoryService.findOneBySellerId(payload.userRoleId,updateProductDto.category_id)

        if (!isExist){
          throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'Category Id is'))
        }
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
