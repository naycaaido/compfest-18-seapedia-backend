import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Admin } from "src/features/admin/entities/admin.entity";


export default class AdminSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 AdminSeeder is running');
        const repository = manager.getRepository(Admin)
        await repository.insert([
            {
                user:{
                    id:3
                }
            },
        ])
    }
}