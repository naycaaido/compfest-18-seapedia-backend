import { ProductType } from "src/features/product/product-type/entities/product-type.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";


export default class ProductTypeSeeder implements Seeder{
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 ProductTypeSeeder is running');
        const repository = manager.getRepository(ProductType)
        await repository.insert([
            // Store 1
            // Product 1
            {
                name:"Warna",
                product:{
                    id:1
                },
                is_multiple:false,
                is_required:true,
            },
            {
                name:"Tambahan",
                product:{
                    id:1
                },
                is_multiple:true,
                is_required:false,
  
            },
            // Product 2
            {
                name:"Warna",
                product:{
                    id:2
                },
                is_multiple:false,
                is_required:true,
            },
            // Store 2
            // Product 4
            {
                name:"Warna",
                product:{
                    id:4
                },
                is_multiple:false,
                is_required:true,
            },
            {
                name:"Tambahan",
                product:{
                    id:4
                },
                is_multiple:false,
                is_required:false,
            },
            // Product 6
            {
                name:"Potongan",
                product:{
                    id:6
                },
                is_multiple:true,
                is_required:true,
            },
        ])
    }
}