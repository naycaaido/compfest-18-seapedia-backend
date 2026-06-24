import { Discount } from "src/features/discount/discount/entities/discount.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";
import { DiscountType } from "src/features/discount/discount/entities/discount-type.enum";
import { Promo } from "src/features/discount/promo/entities/promo.entity";
import { Voucher } from "src/features/discount/voucher/entities/voucher.entity";

export default class DiscountSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 DiscountSeeder is running');
        const repositoryPromo = manager.getRepository(Promo)
        const repositoryVoucher = manager.getRepository(Voucher)
        const date = new Date()
        date.setDate(date.getDate() + 5);
        await repositoryPromo.save([
            {
                discount:{
                    name:'Promo Mas',
                    discount_percantage:10,
                    type:DiscountType.PROMO,
                    remaining_usage:1,
                    expired_date: date
                },
                products:[
                    {
                        id:1
                    },
                    {
                        id:2
                    }
                ]
            },
        ])
        await repositoryVoucher.save([
            {
                discount:{
                    name:'Voucher Collab Hampangpang Sandwhich',
                    discount_percantage:25,
                    remaining_usage:3,
                    type:DiscountType.VOUCHER,
                    expired_date: date
                },
                code:"LIMBUS900",
            },
        ])
    }
}