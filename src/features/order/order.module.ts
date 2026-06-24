import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
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
import { System } from '../system/system.entity';
import { SystemModule } from '../system/system.module';
import { DiscountModule } from '../discount/discount/discount.module';
import { OrderHistoryService } from './services/order-history.service';
import { VoucherModule } from '../discount/voucher/voucher.module';
import { JobModule } from '../job/job.module';
import { WalletTransactionModule } from '../wallet/wallet-transaction/wallet-transaction.module';
import { OrderSchedulerService } from 'src/schedulers/refund';

@Module({
  controllers: [OrderController],
  exports:[OrderSchedulerService],
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
    DiscountModule,
    forwardRef(() => SystemModule),
    WalletTransactionModule,
    JobModule,
    VoucherModule
  ],
  providers: [OrderService,OrderHistoryService,OrderSchedulerService],
})
export class OrderModule {}
