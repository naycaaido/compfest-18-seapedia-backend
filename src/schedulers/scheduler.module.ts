import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderHistory } from "src/features/order/entities/order-history.entity";
import { Order } from "src/features/order/entities/order.entity";
import { SystemModule } from "src/features/system/system.module";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { Wallet } from "src/features/wallet/wallet/entities/wallet.entity";
import { OrderSchedulerService } from "./refund";
import { System } from "src/features/system/system.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Wallet,
      WalletTransactions,
      OrderHistory,
      System
    ]),
    
  ],
  providers: [OrderSchedulerService],
  exports: [OrderSchedulerService],
})
export class SchedulerModule {}