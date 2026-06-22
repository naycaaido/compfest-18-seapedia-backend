import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "./order-status.enum";
import { Order } from "./order.entity";

@Entity({name:"order_histories"})
export class OrderHistory extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"enum",enum:OrderStatus})
    status_order!:OrderStatus

    @ManyToOne(() => Order, order => order.orderHistories,{
        onDelete:'CASCADE'
    })
    order!:Order
}