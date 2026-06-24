import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemModule } from "src/features/system/system.module";
import { DiscountUsage } from "../discount/entities/discount-usage.entity";
import { Discount } from "../discount/entities/discount.entity";

import { Promo } from "../promo/entities/promo.entity";
import { Module } from "@nestjs/common";
import { PromoService } from "./promo.service";
import { PromoController } from "./promo.controller";

@Module({
  controllers: [PromoController],
    imports:[
    TypeOrmModule.forFeature([
    //   Discount,
    //   DiscountUsage,
      Promo,
    //   Voucher
    ]),
    SystemModule
  ],
  providers: [PromoService]
})
export class PromoModule {}
