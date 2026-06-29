import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Order } from '../order/entities/order.entity';
import { WalletTransactionModule } from '../wallet/wallet-transaction/wallet-transaction.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Job,
      Order
    ]),
    WalletTransactionModule,
    SystemModule
  ],
  exports:[JobService],
  providers: [JobService],
})
export class JobModule {}
