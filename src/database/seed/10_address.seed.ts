import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";
import { Address } from "src/features/address/entities/address.entity";


export default class AddressSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 AddressSeeder is running');
        const repository = manager.getRepository(Address)
        await repository.save([
            {
                buyer: {
                    id: 1,
                    active_address_id:1
                },
                name: "Rumah",
                receiver_name: "Damar",
                address_detail:
                    "RW 08, Pasar Manggis, Setiabudi, Jakarta Selatan, Dki Jakarta, Jawa, 12850, Indonesia",
                latitude: -6.2088171,
                longitude: 106.8455920,
                province: {
                    id: 15,
                    name: "Dki Jakarta",
                },
                city: {
                    id: 179,
                    name: "Kota Administrasi Jakarta Selatan",
                },
                district: {
                    id: 2762,
                    name: "Setiabudi",
                },
                village: {
                    id: 30303,
                    name: "Pasar Manggis",
                },
            }
        ])
    }
}