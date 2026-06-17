import path from "path";
import { DirType } from "src/common/utils";
import { Store } from "src/features/store/entities/store.entity";
import { Seeder } from "./main.seed";
import { EntityManager } from "typeorm";



export default class StoreSeeder implements Seeder{
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 StoreSeeder is running');
        const repository = manager.getRepository(Store)
        await repository.insert([
            {
                name:"Toko Raja Bandung",
                image_id: path.join(DirType.STORE, 'borma_id.seed.png'),
                address:"Jawa Barat, Kota Bandung, Kecamatan Lengkong, Kelurahan Turangga, Jl. Buah Batu No.123",
                latitude: -6.9380,
                longitude: 107.6235,
                phone_number:"+6282124805253",
                seller:{
                    user:{
                        id:1
                    }
                }
            },
            {
                name:"Toko Raja Jakarta Selatan",
                image_id: path.join(DirType.STORE, 'superindo_id.seed.png'),
                address:"DKI Jakarta, Kota Jakarta Selatan, Kecamatan Tebet, Kelurahan Tebet Barat, Jl. Tebet Barat Dalam Raya No. 25",
                latitude: -6.2383,
                longitude: 106.8496,
                phone_number:"+6282124805254",
                seller:{
                    user:{
                        id:2
                    }
                }
            }
        ])
    }

}