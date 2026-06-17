import { ProductCategory } from "src/features/product/product-category/entities/product-category.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";


export default class ProductCategorySeeder implements Seeder {
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 ProductCategorySeeder is running');
        const repository = manager.getRepository(ProductCategory)
        await repository.insert([
            // Store 1
            // Product 1 dan 2
            {
                name:"Perlengkapan Kendaraan",
                seller:{
                    id:1
                }
            },
            // Product 3
            {
                name:"Furniture",
                seller:{
                    id:1
                }
            },
            // Store 2
            // Product 4 dan 5
            {
                name:"Teknologi",
                seller:{
                    id:2
                }
            },
            // Product 6
            {
                name:"Daging",
                seller:{
                    id:2
                }
            }
        ])
    }
}