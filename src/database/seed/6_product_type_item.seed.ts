import { ProductTypeItem } from "src/features/product/product-type-item/entities/product-type-item.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";

export default class ProductTypeItemSeeder implements Seeder{
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 ProductTypeItemSeeder is running');
        const repository = manager.getRepository(ProductTypeItem)
        await repository.insert([
            // Store 1
            // Product 1, Warna 1
            {
                name:"Biru",
                stock:5,
                price:0,
                type:{
                    id:1
                }
            },
            {
                name:"Hitam",
                stock:5,
                price:0,
                type:{
                    id:1
                }
            },
            // Product 1, Tambahan 2
            {
                name:"Oil",
                stock:20,
                price:20_000,
                type:{
                    id:2
                }
            },
            {
                name:"Bensin",
                stock:30,
                price:19_450,
                type:{
                    id:2
                }
            },
            // Product 2, Warna 3
            {
                name:"Putih",
                stock:5,
                price:0,
                type:{
                    id:3
                }
            },
            {
                name:"Cokelat",
                stock:5,
                price:0,
                type:{
                    id:3
                }
            },
            // Store 2
            // Product 4, Warna 4
            {
                name:"Silver",
                stock:5,
                price:0,
                type:{
                    id:4
                }
            },
            {
                name:"Hitam",
                stock:5,
                price:0,
                type:{
                    id:4
                }
            },
            // Product 4, Tambahan 5
            {
                name:"Garansi",
                stock:10,
                price:100_000,
                type:{
                    id:5
                }
            },
            {
                name:"Charger",
                stock:10,
                price:45_000,
                type:{
                    id:5
                }
            },
            // Product 6, Potongan 6
            {
                name:"Dada",
                stock:100,
                price:0,
                type:{
                    id:6
                }
            },
            {
                name:"Paha Atas",
                stock:100,
                price:0,
                type:{
                    id:6
                }
            },
            {
                name:"Paha Bawah",
                stock:100,
                price:0,
                type:{
                    id:6
                }
            },
        ])
    }
}