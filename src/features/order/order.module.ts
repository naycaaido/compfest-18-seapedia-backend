import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProductType } from './entities/order-product-type.entity';
import { OrderProductTypeItem } from './entities/order-product-type-item.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { OrderAddress } from './entities/order-address.entity';
import { Cart } from '../cart/cart/entities/cart.entity';
import { DeliveryModule } from './delivery/delivery.module';
import { Address } from '../address/entities/address.entity';
import { Store } from '../store/entities/store.entity';
import { Buyer } from '../buyer/entities/buyer.entity';
import { System } from '../system/system.entity';
import { SystemModule } from '../system/system.module';

@Module({
  controllers: [OrderController],
  imports:[
    TypeOrmModule.forFeature([
      Cart,
      Order,
      OrderItem,
      OrderHistory,
      OrderAddress,
      OrderProductType,
      OrderProductTypeItem,
      Store,
      Address,
      System
    ]),
    DeliveryModule,
    SystemModule
  ],
  providers: [OrderService],
})
export class OrderModule {}
