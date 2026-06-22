import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name:"order_addresses"})
export class OrderAddress extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    receiver_name!:string

    @Column({type:"varchar",length:255})
    receiver_phone_number!:string

    @Column({type:"text"})
    receiver_address!:string

    @Column('decimal', {
    precision: 10,
    scale: 8,
    nullable:true
    })
    latitude?: number;

    @Column('decimal', {
    precision: 11,
    scale: 8,
    nullable:true
    })
    longitude?: number;

    @ManyToOne(() => Buyer)
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer

    @OneToOne(() => Order, order => order.orderAddress)
    order!:Order
}