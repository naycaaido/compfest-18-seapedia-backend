import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User} from "./user.entity";
import { UserRole } from "./role_user.enum";

@Entity()
@Unique(['user', 'role'])
export class UserRoles extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"enum",enum:UserRole})
    role!:UserRole

    @Index('idx_user_role_user_id', ['user'])
    @ManyToOne(() => User, user => user.roles,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"user_id"})
    user!:User
}