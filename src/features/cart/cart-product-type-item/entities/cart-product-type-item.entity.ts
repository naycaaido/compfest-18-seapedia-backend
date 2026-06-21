import { BaseEntity } from "src/common/base_entity"
import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { CartProductType } from "../../cart-product-type/entities/cart-product-type.entity"
import { ProductTypeItem } from "src/features/product/product-type-item/entities/product-type-item.entity"
import { Expose } from "class-transformer"

@Entity({name:"cart_product_type_items"})
export class CartProductTypeItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Index("cart_product_types_item_cart_product_type_id")
    @ManyToOne(() => CartProductType, cartProductType => cartProductType.cartProductTypeItems,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"cart_product_type_id"})
    cartProductType!:CartProductType

    @ManyToOne(() => ProductTypeItem,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"product_type_item_id"})
    @Expose({name:"product_type_item"})
    productTypeItem!:ProductTypeItem
}
