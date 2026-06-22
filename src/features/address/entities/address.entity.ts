import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"address"})
export class Address extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"varchar",length:255})
    receiver_name!:string

    @Column({type:"text"})
    address_detail!:string

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

    @ManyToOne(() => Buyer, buyer => buyer.addresses,{
        onDelete:'CASCADE',
        cascade:['insert']
    })
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer
}
