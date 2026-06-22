import { BaseEntity } from "src/common/base_entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Expose } from "class-transformer";
import { ProductType } from "src/features/product/product-type/entities/product-type.entity";
import { OrderProductTypeItem } from "./order-product-type-item.entity";

@Entity({name:"order_product_types"})
export class OrderProductType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(() => OrderItem, orderItem => orderItem.types,{
        onDelete:'CASCADE'
    })
    @Expose({name:"order_item"})
    @JoinColumn({
        name:"order_item_id"
    })
    orderItem!:OrderItem

    @ManyToOne(() => ProductType,{
        onDelete:'CASCADE'
    })
    @Expose({name:"type"})
    @JoinColumn({name:"product_type_id"})
    type!:ProductType

    @OneToMany(() => OrderProductTypeItem, orderProductTypeItems => orderProductTypeItems.orderProductType,{
        cascade:['insert']
    })
    @Expose({name:"items"})
    orderProductTypeItems!:OrderProductTypeItem[]
}