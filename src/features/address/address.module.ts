import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Buyer } from '../buyer/entities/buyer.entity';

@Module({
  controllers: [AddressController],
  imports:[
    TypeOrmModule.forFeature([
      Address,
      Buyer
    ])
  ],
  providers: [AddressService],
})
export class AddressModule {}
