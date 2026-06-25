import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Product } from '../product/product/entities/product.entity';
import { StoreModule } from '../store/store.module';
import { Store } from '../store/entities/store.entity';

@Module({
  controllers: [SellerController],
  imports:[
    TypeOrmModule.forFeature([
      Seller,
      Product,
    ]),
    StoreModule
  ],
  providers: [SellerService],
  exports:[SellerService]
})
export class SellerModule {}
