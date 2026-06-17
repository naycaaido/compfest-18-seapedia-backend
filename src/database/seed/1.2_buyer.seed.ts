import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Buyer } from "src/features/buyer/entities/buyer.entity";


export default class BuyerSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 BuyerSeeder is running');
        const repository = manager.getRepository(Buyer)
        await repository.insert([
            {
                delivery_address:"Jl. Raya Mekarsari, Kelurahan Mekarsari, Kecamatan Cimanggis, Kota Depok, Jawa Barat 16452, Indonesia",
                user:{
                    id:1
                }
            },
        ])
    }
}