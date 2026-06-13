import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';

@Module({
  controllers: [BuyerController],
  imports:[TypeOrmModule.forFeature([
      Buyer
    ])],
  providers: [BuyerService],
  exports:[BuyerService]
})
export class BuyerModule {}
