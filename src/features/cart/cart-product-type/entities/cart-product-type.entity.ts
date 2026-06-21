import { BaseEntity } from "src/common/base_entity";
import { ProductType } from "src/features/product/product-type/entities/product-type.entity";
import { Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "../../cart-item/entities/cart-item.entity";
import { CartProductTypeItem } from "../../cart-product-type-item/entities/cart-product-type-item.entity";
import { Expose } from "class-transformer";

@Entity({name:"cart_product_types"})
export class CartProductType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Index("cart_product_types_cart_item_id")
    @ManyToOne(() => CartItem, cartItem => cartItem.cartProductTypes,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"cart_item_id"})
    cartItem!:CartItem

    @ManyToOne(() => ProductType,{
        onDelete:'CASCADE'
    })
    @Expose({name:"product_type"})
    @JoinColumn({name:"product_type_id"})
    productType!:ProductType

    @OneToMany(() => CartProductTypeItem, cartProductTypeItems => cartProductTypeItems.cartProductType,{
        cascade:['insert']
    })
    @Expose({name:"cart_product_type_items"})
    cartProductTypeItems!:CartProductTypeItem[]
}
