import path from "path";
import { DirType } from "src/common/utils";
import { ProductImage } from "src/features/product/product-image/entities/product-image.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";


export default class ProductImageSeeder implements Seeder{
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 ProductImageSeeder is running');
        const repository = manager.getRepository(ProductImage)
        await repository.insert([
            // Store 1
            {
                image_id: path.join(DirType.PRODUCT, 'roda_id.seed.jpg'),
                product:{
                    id:1
                }
            },
            {
                image_id: path.join(DirType.PRODUCT, 'steering_wheel_id.seed.jpg'),
                product:{
                    id:2
                }
            },
            // Store 2
            {
                image_id: path.join(DirType.PRODUCT, 'laptop_id.seed.jpg'),
                product:{
                    id:4
                }
            },
            {
                image_id: path.join(DirType.PRODUCT, 'laptop_id_2.seed.jpg'),
                product:{
                    id:4
                }
            },
            {
                image_id: path.join(DirType.PRODUCT, 'hp_lenovo_id.seed.jpg'),
                product:{
                    id:5
                }
            },
            {
                image_id: path.join(DirType.PRODUCT, 'ayam_dada_id.seed.jpg'),
                product:{
                    id:6
                }
            },
                        {
                image_id: path.join(DirType.PRODUCT, 'ayam_paha_atas_id.seed.jpg'),
                product:{
                    id:6
                }
            },
                        {
                image_id: path.join(DirType.PRODUCT, 'ayam_paha_bawah_id.seed.jpg'),
                product:{
                    id:6
                }
            },
        ])
    }
}