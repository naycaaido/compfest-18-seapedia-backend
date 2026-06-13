import { Injectable } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BuyerService {
  
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ){}

  async create(createBuyerDto: CreateBuyerDto) {
    return 'This action adds a new buyer';
  }

  createForUser(userId:number){
    return this.buyerRepository.create({
      user:{
        id:userId
      }
    })
  }

  findAll() {
    return `This action returns all buyer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
