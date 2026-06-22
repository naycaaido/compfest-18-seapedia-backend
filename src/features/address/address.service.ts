import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { Buyer } from '../buyer/entities/buyer.entity';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { log } from 'console';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository:Repository<Address>,
    @InjectRepository(Buyer)
    private buyerRepository:Repository<Buyer>
  ) {}

  async create(createAddressDto: CreateAddressDto,payload:Payload) {
    const address = this.addressRepository.create({
      ...createAddressDto,
      buyer:{
        id:payload.userRoleId
      }
    })
    const addressSaved = await this.addressRepository.save(address)
    const buyer = await this.findBuyerPayload(payload)
    if(!buyer){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer"))
    }
    if(!buyer.active_address_id){
      buyer.active_address_id = addressSaved.id
      await this.buyerRepository.save(buyer)
    }
    return address;
  }

  async findAll(payload:Payload) {
    return await this.addressRepository.findBy({
      buyer:{
        id:payload.userRoleId
      }
    })
  }

  async findActive(payload:Payload){
    const buyer = await this.findBuyerPayload(payload)
    if(!buyer){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer"))
    }

    const activeAddressId = buyer?.active_address_id
    if (activeAddressId == null) {
      throw new NotFoundException(
        exceptionMessage(ExceptionType.NOT_FOUND, "Active Address")
      )
    }

    const address = await this.addressRepository.findOneBy({
      id: activeAddressId
    })
    return address
  }

  async findOne(id: number, payload:Payload) {
    return await this.addressRepository.findOneBy({
      id,
      buyer:{
        id:payload.userRoleId
      }
    });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, payload:Payload) {
    const address = await this.addressRepository.findOne({
      where:{
        id,
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        buyer:true
      }
    })
    if(!address){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Address'));
    }

    if(updateAddressDto.is_active){
      const buyer = address.buyer
      buyer.active_address_id = address.id
      await this.buyerRepository.save(buyer)
    }
    const update = this.addressRepository.merge(address,updateAddressDto)
    return await this.addressRepository.save(update)
  }

  async remove(id: number,payload:Payload) {
    const address = await this.addressRepository.findOne({
      where:{
        id,
        buyer:{
          id:payload.userRoleId
        }
      },
    })
    if (!address) {
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Address'));
    }
        
    const result = await this.addressRepository.delete({id:address.id})
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }

  private async findBuyerPayload(payload:Payload){
    return await this.buyerRepository.findOneBy({
      id:payload.userRoleId
    })
  }
}
