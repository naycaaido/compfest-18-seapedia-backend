import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  controllers: [CartController],
  imports:[TypeOrmModule.forFeature([
    Cart
  ]),
  CartItemModule
  ],
  providers: [CartService],
})
export class CartModule {}
