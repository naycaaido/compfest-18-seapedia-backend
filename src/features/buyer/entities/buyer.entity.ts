import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Exclude } from "class-transformer";
import { Cart } from "src/features/cart/cart/entities/cart.entity";
import { Address } from "src/features/address/entities/address.entity";

@Entity({name:"buyers"})
export class Buyer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({
        type: 'int',
        nullable: true
    })
    active_address_id?: number | null

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

    @OneToMany(() => Address, addresses => addresses.buyer,{
        cascade:['insert']
    })
    addresses!:Address[]
}