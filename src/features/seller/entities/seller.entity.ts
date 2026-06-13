import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({name:"sellers"})
export class Seller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @OneToOne(() => User, (user) => user.seller,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:"user_id"})
    user!:User
}