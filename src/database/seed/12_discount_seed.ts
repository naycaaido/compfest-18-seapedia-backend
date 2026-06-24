import { Discount } from "src/features/discount/discount/entities/discount.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";
import { DiscountType } from "src/features/discount/discount/entities/discount-type.enum";

export default class DiscountSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 DiscountSeeder is running');
        const repository = manager.getRepository(Discount)
        const date = new Date()
        await repository.save([
            {
                name:'Promo Roda',
                discount_percantage:10,
                type:DiscountType.PROMO,
                expired_date: date.setDate(date.getDate() + 5)
            },
            {
                name:'Voucher Tembuh Murah 20%',
                discount_percantage:20,
                type:DiscountType.VOUCHER,
                remaining_usage:1,
                expired_date: date.setDate(date.getDate() + 5)
            }
        ])
    }
}