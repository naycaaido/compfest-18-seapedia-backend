import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { System } from "src/features/system/system.entity";

export default class SystemSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 SystemSeeder is running');
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const repository = manager.getRepository(System)
        await repository.save([
            {
                current_date:new Date().toISOString().split('T')[0]
            }
        ])
    }
}