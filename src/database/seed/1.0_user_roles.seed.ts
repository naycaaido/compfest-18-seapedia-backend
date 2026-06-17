import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { UserRoles } from "src/features/user/entities/user_role.entity";
import { UserRole } from "src/features/user/entities/role_user.enum";



export default class UserRolesSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 UserRolesSeeder is running');
        const repository = manager.getRepository(UserRoles)
        await repository.insert([
            // User 1
            {
                role:UserRole.SELLER,
                user:{
                    id:1
                }
            },
            {
                role:UserRole.BUYER,
                user:{
                    id:1
                }
            },
            // User 2
            {
                role:UserRole.SELLER,
                user:{
                    id:2
                }
            },
            // User 3
            {
                role:UserRole.ADMIN,
                user:{
                    id:3
                }
            }
        ])
    }
}