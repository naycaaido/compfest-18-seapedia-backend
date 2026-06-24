import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Seller } from "src/features/seller/entities/seller.entity";

export default class SellerSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 SellerSeeder is running');
        const repository = manager.getRepository(Seller)
        await repository.insert([
            {
                user:{
                    id:1
                }
            },
            {
                user:{
                    id:2
                }
            },
            {
                user:{
                    id:5
                }
            }
        ])
    }
}