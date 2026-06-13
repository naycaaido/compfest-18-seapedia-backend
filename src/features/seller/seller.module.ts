import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';

@Module({
  controllers: [SellerController],
  imports:[
    TypeOrmModule.forFeature([
      Seller
    ]),
  ],
  providers: [SellerService],
  exports:[SellerService]
})
export class SellerModule {}
