import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Driver } from "src/features/driver/entities/driver.entity";


export default class DriverSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 DriverSeeder is running');
        const repository = manager.getRepository(Driver)
        await repository.insert([
            {
                user:{
                    id:4
                }
            }
        ])
    }
}