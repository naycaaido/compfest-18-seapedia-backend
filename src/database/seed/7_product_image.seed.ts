import { DirType } from "src/common/utils";
import { ProductImage } from "src/features/product/product-image/entities/product-image.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";
import { uploadSeedImage } from "./helpers/supabase.helper";



export default class ProductImageSeeder implements Seeder {
    track?: boolean;

    async run(manager: EntityManager): Promise<any> {
        console.log("🔥 ProductImageSeeder is running");

        const repository = manager.getRepository(ProductImage);

        await repository.insert([
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "roda_id.seed.jpg"
                ),
                product: { id: 1 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "steering_wheel_id.seed.jpg"
                ),
                product: { id: 2 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "laptop_id.seed.jpg"
                ),
                product: { id: 4 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "laptop_id_2.seed.jpg"
                ),
                product: { id: 4 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "hp_lenovo_id.seed.jpg"
                ),
                product: { id: 5 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "ayam_dada_id.seed.jpg"
                ),
                product: { id: 6 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "ayam_paha_atas_id.seed.jpg"
                ),
                product: { id: 6 },
            },
            {
                image_id: await uploadSeedImage(
                    DirType.PRODUCT,
                    "ayam_paha_bawah_id.seed.jpg"
                ),
                product: { id: 6 },
            },
        ]);
    }
}

