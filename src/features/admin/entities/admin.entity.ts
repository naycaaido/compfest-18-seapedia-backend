import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({name:"admins"})
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @OneToOne(() => User, (user) => user.admin,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:"user_id"})
    user!:User
}