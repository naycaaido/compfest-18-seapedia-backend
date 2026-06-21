import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Exclude } from "class-transformer";
import { Cart } from "src/features/cart/cart/entities/cart.entity";

@Entity({name:"buyers"})
export class Buyer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255,
        nullable:true
    })
    delivery_address?:string

    @Column({type:"varchar",length:"20",nullable:true})
    phone_number?:string

    @OneToOne(() => Cart, cart => cart.buyer,{
        cascade:['insert']
    })
    cart!:Cart

    @OneToOne(() => User, (user) => user.buyer,{
        onDelete:'CASCADE',
    })
    @Exclude()
    @JoinColumn({name:"user_id"})
    user!:User
}