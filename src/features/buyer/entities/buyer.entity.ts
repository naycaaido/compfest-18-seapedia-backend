import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Exclude } from "class-transformer";

@Entity({name:"buyers"})
export class Buyer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"int",default:0})
    wallet_balance!:number

    @Column({type:"varchar",length:255,
        nullable:true
    })
    delivery_address?:string

    @Column('decimal', {
    precision: 10,
    scale: 8,
    nullable:true
    })
    latitude?: number;

    @Column('decimal', {
    precision: 11,
    scale: 8,
    nullable:true
    })
    longitude?: number;

    @OneToOne(() => User, (user) => user.buyer,{
        onDelete:'CASCADE',
    })
    @Exclude()
    @JoinColumn({name:"user_id"})
    user!:User
}