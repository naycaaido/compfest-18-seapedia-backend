import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductModule } from 'src/features/product/product/product.module';
import { ProductTypeItemModule } from 'src/features/product/product-type-item/product-type-item.module';
import { Cart } from '../cart/entities/cart.entity';
import { CartProductType } from '../cart-product-type/entities/cart-product-type.entity';

@Module({
  exports:[CartItemService],
  imports:[TypeOrmModule.forFeature([
    CartItem,
    CartProductType
  ]),
  ProductModule,
  ProductTypeItemModule,
],
  providers: [CartItemService],
})
export class CartItemModule {}
