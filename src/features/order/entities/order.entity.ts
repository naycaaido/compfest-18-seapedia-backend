import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { DeliveryMethod } from "./delivery-method.enum";
import { Store } from "src/features/store/entities/store.entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { OrderAddress } from "./order-address.entity";
import { OrderItem } from "./order-item.entity";
import { Expose } from "class-transformer";
import { OrderStatus } from "./order-status.enum";
import { OrderHistory } from "./order-history.entity";
import { Voucher } from "src/features/discount/voucher/entities/voucher.entity";

@Entity({name:"orders"})
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:'enum',enum:DeliveryMethod})
    delivery_method!:DeliveryMethod

    @Column({type:'int'})
    distance_journey!:number

    @Column({type:'timestamp'})
    overdue!:Date

    @Column({type:'int'})  
    delivery_fee!:number

    @Column({type:'int'})
    tax_fee!:number

    @Column({type:'int'})
    sub_total!: number

    @Column({type:'int'})
    total_fee!: number

    @ManyToOne(() => Voucher, {
        nullable: true
    })
    @JoinColumn({ name: 'voucher_id' })
    voucher?: Voucher

    @Column({ type: 'int', default: 0 })
    voucher_discount!: number

    @Index("idx_order_status")
    @Column({
    type: 'enum',
    enum: OrderStatus,
    })
    status!: OrderStatus

    @Expose({name:"order_items"})
    @OneToMany(() => OrderItem, orderItems => orderItems.order,{
        cascade:['insert']
    })
    orderItems!:OrderItem[]

    @Expose({name:"order_histories"})
    @OneToMany(() => OrderHistory, orderHistories => orderHistories.order,{
        cascade:['insert']
    })
    orderHistories!:OrderHistory[]

    @Index("idx_order_store_id")
    @ManyToOne(() => Store, store => store.orders)
    @JoinColumn({name:"store_id"})
    store!:Store

    @Index("idx_order_buyer_id")
    @ManyToOne(() => Buyer, buyer => buyer.orders)
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer

    @Index("idx_order_order_address_id")
    @Expose({name:"order_address"})
    @OneToOne(() => OrderAddress, orderAddressr => orderAddressr.order,{
        cascade:['insert']
    })
    @JoinColumn({name:"order_address_id"})
    orderAddress!:OrderAddress

    // voucher
}
