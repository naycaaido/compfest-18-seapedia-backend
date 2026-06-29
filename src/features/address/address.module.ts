import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Buyer } from '../buyer/entities/buyer.entity';
import { City, District, Province, Village } from '../store/entities/region.entity';
import { GeocodingService } from '../store/geocode.service';

@Module({
  controllers: [AddressController],
  imports:[
    TypeOrmModule.forFeature([
      Address,
      Buyer,
      Village,
      District,
      City,
      Province,
    ]),
  ],
  providers: [AddressService,GeocodingService],
})
export class AddressModule {}
