import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../cart/entities/cart.entity";
import { Product } from "src/features/product/product/entities/product.entity";
import { CartProductType } from "../../cart-product-type/entities/cart-product-type.entity";
import { Expose } from "class-transformer";

@Entity({name:"cart_item"})
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"int",default:0})
    quantity!:number

    @Index("idx_cart_item_product_id")
    @ManyToOne(() => Product,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"product_id"})
    product!:Product

    @Index("idx_cart_item_cart_id")
    @ManyToOne(() => Cart, cart => cart.cartItems,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"cart_id"})
    cart!:Cart

    @Column({ type: "int", default: 0 })
    sub_total!: number

    @Expose({name:"cart_product_types"})
    @OneToMany(() => CartProductType, cartProductType => cartProductType.cartItem,{
        cascade:['insert']
    })
    cartProductTypes!:CartProductType[]
}
