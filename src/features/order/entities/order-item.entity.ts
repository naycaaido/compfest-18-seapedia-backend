import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/features/product/product/entities/product.entity";
import { OrderProductType } from "./order-product-type.entity";

@Entity({name:"order_item"})
export class OrderItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"int"})
    sub_total!:number

    @Column({type:"int"})
    quantity!:number

    @OneToMany(() => OrderProductType, orderProductTypes => orderProductTypes.orderItem,{
        cascade:['insert']
    })
    types!:OrderProductType[]

    @Index("idx_order_item_order_id")
    @ManyToOne(() => Order, order => order.orderItems,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"order_id"})
    order!:Order

    @Index("idx_order_item_product_id")
    @ManyToOne(() => Product, product => product.orderItems,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"product_id"})
    product!:Product
    // promo id
}