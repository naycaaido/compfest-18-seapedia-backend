import { Module } from '@nestjs/common';
import { CartProductTypeItemService } from './cart-product-type-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductTypeItem } from './entities/cart-product-type-item.entity';

@Module({
  providers: [CartProductTypeItemService],
  imports:[TypeOrmModule.forFeature([
    CartProductTypeItem
  ])],
  exports:[CartProductTypeItemService]
})
export class CartProductTypeItemModule {}
