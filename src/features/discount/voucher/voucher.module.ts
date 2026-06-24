import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemModule } from "src/features/system/system.module";
import { DiscountUsage } from "../discount/entities/discount-usage.entity";
import { Discount } from "../discount/entities/discount.entity";
import { Promo } from "../promo/entities/promo.entity";
import { Voucher } from "./entities/voucher.entity";
import { VoucherService } from "./voucher.service";
import { VoucherController } from "./voucher.controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [VoucherController],
    imports:[
    TypeOrmModule.forFeature([
    //   Discount,
    //   DiscountUsage,
    //   PromoProduct,
    //   Promo,
      Voucher
    ]),
    SystemModule
  ],
  providers: [VoucherService]
})
export class VoucherModule {}
