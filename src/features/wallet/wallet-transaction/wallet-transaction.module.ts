import { Module } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { WalletTransactionController } from './wallet-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactions } from './entities/wallet-transaction.entity';

@Module({
  controllers: [WalletTransactionController],
  imports:[
    TypeOrmModule.forFeature([
      WalletTransactions
    ])
  ],
  providers: [WalletTransactionService],
})
export class WalletTransactionModule {}
