import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountUsage } from './entities/discount-usage.entity';
import { Promo } from '../promo/entities/promo.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { SystemModule } from '../../system/system.module';

@Module({
  controllers: [DiscountController],
  imports:[
    TypeOrmModule.forFeature([
      Discount,
      DiscountUsage,
      Promo,
      Voucher
    ]),
    SystemModule
  ],
  exports:[DiscountService],
  providers: [DiscountService],
})
export class DiscountModule {}
