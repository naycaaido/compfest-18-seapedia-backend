import * as bcrypt from 'bcrypt'
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { User } from 'src/features/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { Seeder } from './main.seed';

export default class UserSeeder implements Seeder {
    track?: boolean | undefined;
    
    async run(manager:EntityManager): Promise<any> {
        console.log('🔥 UserSeeder is running');
        const repository = manager.getRepository(User)
        const password = '12345678'
        const hashPassword = await bcrypt.hash(password,10)
        await repository.insert([
            {
                full_name:"User 1",
                email:"user1@gmail.com",
                password:hashPassword,
                roles:[
                    {
                        role:UserRole.SELLER,
                    },
                    {
                        role:UserRole.BUYER
                    }
                ]
            },
            {
                full_name:"User 2",
                email:"user2@gmail.com",
                password:hashPassword,
                roles:[
                    {
                        role:UserRole.SELLER,
                    }
                ]
            },
            {
                full_name:"Admin 1",
                email:"admin1@gmail.com",
                password:hashPassword,
                roles:[
                    {
                        role:UserRole.ADMIN,
                    }
                ]
            }
        ])
    }
}