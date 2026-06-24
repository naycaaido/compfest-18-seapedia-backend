import { Product } from "src/features/product/product/entities/product.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";


export default class ProductSeeder implements Seeder{
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 ProductSeeder is running');
        const repository = manager.getRepository(Product)
        await repository.insert([
            // Store 1
            {
                name:"Roda",
                price:20_000,
                stock:10,
                store:{
                    id:1
                },
                category:{
                    id:1
                }       
            },
            {
                name:"Steering Wheel",
                price:15_000,
                stock:10,
                store:{
                    id:1
                },
                category:{
                    id:1
                }
            },
            {
                name:"Meja",
                price:35_000,
                stock:10,
                store:{
                    id:1
                },
                category:{
                    id:2
                }
            },

            // Store 2
            {
                name:"Laptop",
                price:12_000_000,
                stock:10,
                store:{
                    id:2
                },
                category:{
                    id:3
                }
            },
            {
                name:"Hp Lenovo",
                price:2_720_000,
                stock:10,
                store:{
                    id:2
                },
                category:{
                    id:3
                }
            },
            {
                name:"Ayam 300 Gram",
                price:21_000,
                stock:10,
                store:{
                    id:2
                },
                category:{
                    id:4
                }
            }
        ])
    }
}