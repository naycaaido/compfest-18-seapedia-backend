import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  controllers: [BuyerController],
  imports:[TypeOrmModule.forFeature([
      Buyer,
      Address
    ])],
  providers: [BuyerService],
  exports:[BuyerService]
})
export class BuyerModule {}
