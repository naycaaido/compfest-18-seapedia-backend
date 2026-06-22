import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "../../cart-item/entities/cart-item.entity";
import { Expose } from "class-transformer";

@Entity({name:"carts"})
export class Cart extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"int",default:null, nullable:true})
    store_id?:number | null

    @Column({type:"int",default:0})
    sub_total!:number

    @OneToMany(() => CartItem, cartItems => cartItems.cart,{
        cascade:['insert','remove']
    })
    @Expose({name:"cart_items"})
    cartItems!:CartItem[]

    @Index("carts_buyer_id")
    @OneToOne(() => Buyer, buyer => buyer.cart,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer
}
