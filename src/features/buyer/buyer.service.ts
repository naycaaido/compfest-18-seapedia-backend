import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Address } from '../address/entities/address.entity';
import { log } from 'console';

@Injectable()
export class BuyerService {
  
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ){}

  async create(createBuyerDto: CreateBuyerDto) {
    return 'This action adds a new buyer';
  }

  createForUser(userId:number){
    return this.buyerRepository.create({
      user:{
        id:userId
      },
      cart:{
        buyer:{
          id:userId
        }
      }
    })
  }

  findAll() {
    return `This action returns all buyer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }
  async validBuyer(payload:Payload){
    const buyer = await this.buyerRepository.findOne({
      where:{
        id:payload.userRoleId
      },
      relations:{
        addresses:true,
      }
    })
    if(!buyer){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer Not Found"))
    }
    const isValid = buyer.addresses.length > 0 && buyer.phone_number != null
    return isValid
  }

  async update(payload:Payload, updateBuyerDto: UpdateBuyerDto) {
    const buyer = await this.buyerRepository.findOneBy({
      id:payload.userRoleId
    })
    if(!buyer){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer"))
    }
    if(updateBuyerDto.active_address_id){
      const existAddress = await this.addressRepository.existsBy({
        id:updateBuyerDto.active_address_id,
        buyer:{
          id:buyer.id
        }
      })
      if(!existAddress){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Address"))
      }
    }
    const updated = this.buyerRepository.create({
      ...updateBuyerDto
    })
    const buyerUpdate = this.buyerRepository.merge(buyer,updated)
    return await this.buyerRepository.save(buyerUpdate)
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
