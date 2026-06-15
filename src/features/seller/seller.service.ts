import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository:Repository<Seller>
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

  findAll() {
    return `This action returns all seller`;
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
}
