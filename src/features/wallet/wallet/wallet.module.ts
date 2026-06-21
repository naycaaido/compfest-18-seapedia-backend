import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';

@Module({
  controllers: [WalletController],
  imports:[
    TypeOrmModule.forFeature([
      Wallet
    ])
  ],
  providers: [WalletService],
})
export class WalletModule {}
