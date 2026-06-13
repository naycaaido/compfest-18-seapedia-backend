import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({name:"drivers"})
export class Driver extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @OneToOne(() => User, (user) => user.driver,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:"user_id"})
    user!:User
}