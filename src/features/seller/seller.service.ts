import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/product/entities/product.entity';
import { Payload } from 'src/common/utils';
import { Store } from '../store/entities/store.entity';


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

  async findAllProducts(payload:Payload) {
    return await this.productRepository.find({
      where:{
        store:{
          seller:{
            id:payload.userRoleId
          }
        }
      },
      relations:SellerService.productRelation
    });
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
