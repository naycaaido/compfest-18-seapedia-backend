import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { FindOptionsRelations, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/product/entities/product.entity';
import { Payload } from 'src/common/utils';
import { Store } from '../store/entities/store.entity';
import { FindProductBySellerDto } from './dto/find-product-by-seller.dto';


@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository:Repository<Seller>,
    @InjectRepository(Product)
    private productRepository:Repository<Product>
  ) {
    
  }
  create(createSellerDto: CreateSellerDto) {
    return 'This action adds a new seller';
  }

  createForUser(userId:number){
    return this.sellerRepository.create({
      user:{
        id:userId
      }
    })
  }

  async findAllProducts(payload:Payload,dto:FindProductBySellerDto) {
    let where:FindOptionsWhere<Product> ={
      store:{
        seller:{
          id:payload.userRoleId
        }
      }
    }

    if (dto.name) {
      where.name = ILike(`%${dto.name}%`);
    }
    const products =  await this.productRepository.find({
      where,
      relations:SellerService.productRelation
    });
    
    const availableProducts: Product[] = [];
    const unavailableProducts: Product[] = [];

    let availableCount = 0;
    let unavailableCount = 0;

    for (const product of products) {
      if (product.is_available) {
        availableProducts.push(product);
        availableCount++;
      } else {
        unavailableProducts.push(product);
        unavailableCount++;
      }
    }
    return {
      available: {
        count: availableCount,
        products: availableProducts,
      },
      unavailable: {
        count: unavailableCount,
        products: unavailableProducts,
      },
      total: products.length,
    };
  }

  async findOne(id: number) {
    return await this.sellerRepository.findOne({
      where:{
        id
      },
      loadRelationIds:{
        relations:[
          "store"
        ]
      }
    });
  }



  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }

  private static productRelation : FindOptionsRelations<Product> = {
      promo:{
        discount:true
      },
      images:true,
      types:{
        items:true
      },
      category:true
    }
  
}
