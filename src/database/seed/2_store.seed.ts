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
        await repository.save([
            {
                name:"Toko Raja Bandung",
                image_id: path.join(DirType.STORE, 'borma_id.seed.png'),
                address: "Jl. Buah Batu No.123, Kelurahan Turangga, Kecamatan Lengkong, Kota Bandung, Jawa Barat",
                latitude: -6.9380,
                longitude: 107.6235,
                phone_number:"+6282124805253",
                seller:{
                    id:1
                },
                province:{
                    id:1,
                    name: "Jawa Barat"
                },
                city:{
                    id:18,
                    name: "Kota Bandung"
                },
                district:{
                    id:2237,
                    name: "Lengkong"
                },
                village:{
                    id:24830,
                    name:"Turangga"
                }
            },
            {
                name:"Toko Raja Jakarta Selatan",
                image_id: path.join(DirType.STORE, 'superindo_id.seed.png'),
                address: "Jl. Tebet Barat Dalam Raya No. 25, Kelurahan Tebet Barat, Kecamatan Tebet, Kota Jakarta Selatan, DKI Jakarta",
                latitude: -6.2383,
                longitude: 106.8496,
                phone_number:"+6282124805254",
                seller:{
                    id:2
                },
                province:{
                    id:15,
                    name: "Dki Jakarta"
                },
                city:{
                    id:179,
                    name: "Kota Administrasi Jakarta Selatan"
                },
                district:{
                    id:2739,
                    name: "Tebet"
                },
                village:{
                    id:30382,
                    name:"Tebet Barat"
                }
            },
            {
                name:"Toko Raja Surabaya",
                address: "Jl. Raya Darmo No. 115, Kelurahan Darmo, Kecamatan Wonokromo, Kota Surabaya, Jawa Timur",
                latitude: -7.2906,
                longitude: 112.7398,
                phone_number:"+6282124805255",
                seller:{
                    id:3
                },
                province:{
                    id:6,
                    name: "Jawa Timur"
                },
                city:{
                    id:67,
                    name: "Kota Surabaya"
                },
                district:{
                    id:1252,
                    name: "Wonokromo"
                },
                village:{
                    id:8540,
                    name:"Darmo"
                }
            }
        ])
    }

}