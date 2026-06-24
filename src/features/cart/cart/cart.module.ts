import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItemModule } from '../cart-item/cart-item.module';
import { Store } from 'src/features/store/entities/store.entity';
import { Product } from 'src/features/product/product/entities/product.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { SystemModule } from 'src/features/system/system.module';
import { DiscountModule } from 'src/features/discount/discount/discount.module';

@Module({
  controllers: [CartController],
  imports:[TypeOrmModule.forFeature([
    Cart,
    CartItem
  ]),
  CartItemModule,
  DiscountModule,
  SystemModule
  ],
  providers: [CartService],
})
export class CartModule {}
