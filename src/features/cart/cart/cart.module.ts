import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItemModule } from '../cart-item/cart-item.module';
import { Store } from 'src/features/store/entities/store.entity';
import { Product } from 'src/features/product/product/entities/product.entity';

@Module({
  controllers: [CartController],
  imports:[TypeOrmModule.forFeature([
    Cart,
    Store,
    Product
  ]),
  CartItemModule
  ],
  providers: [CartService],
})
export class CartModule {}
