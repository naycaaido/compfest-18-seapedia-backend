import { Module } from '@nestjs/common';
import { CartProductTypeService } from './cart-product-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductType } from './entities/cart-product-type.entity';

@Module({
  exports:[
    CartProductTypeService
  ],
  imports:[
    TypeOrmModule.forFeature([CartProductType])
  ],
  providers: [CartProductTypeService],
})
export class CartProductTypeModule {}
