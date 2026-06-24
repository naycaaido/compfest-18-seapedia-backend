import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "../../cart-item/entities/cart-item.entity";
import { Expose } from "class-transformer";
import { Voucher } from "src/features/discount/voucher/entities/voucher.entity";

@Entity({name:"carts"})
export class Cart extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"int",default:null, nullable:true})
    store_id?:number | null

    @Column({type:"int",default:0})
    sub_total!:number

    @ManyToOne(() => Voucher,{
        nullable:true
    })
    @JoinColumn({name:'voucher_id'})
    voucher?:Voucher

    @Expose({name:"cart_items"})
    @OneToMany(() => CartItem, cartItems => cartItems.cart,{
        cascade:['insert','remove']
    })
    cartItems!:CartItem[]

    @Index("carts_buyer_id")
    @OneToOne(() => Buyer, buyer => buyer.cart,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer
}
