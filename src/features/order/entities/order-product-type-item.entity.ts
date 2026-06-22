import { BaseEntity } from "src/common/base_entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderProductType } from "./order-product-type.entity";
import { ProductTypeItem } from "src/features/product/product-type-item/entities/product-type-item.entity";

@Entity({name:'order_product_type_item'})
export class OrderProductTypeItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(() => ProductTypeItem,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"product_type_item_id"})
    item!:ProductTypeItem

    @ManyToOne(() => OrderProductType, orderProductType => orderProductType.orderProductTypeItems,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"order_product_type_id"})
    orderProductType!:OrderProductType
}