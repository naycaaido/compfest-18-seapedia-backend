import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Buyer } from "src/features/buyer/entities/buyer.entity";


export default class BuyerSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 BuyerSeeder is running');
        const repository = manager.getRepository(Buyer)
        await repository.insert([
            {
                phone_number:"+6282124805253",
                user:{
                    id:1
                }
            },
        ])
    }
}