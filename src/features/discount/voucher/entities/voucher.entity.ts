import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Discount } from "../../discount/entities/discount.entity";

@Entity({name:'vouchers'})
export class Voucher extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:'varchar',length:255,unique:true})
    code!:string

    @Index("idx_voucher_discount_id")
    @OneToOne(() => Discount, discount => discount.voucher,{
        onDelete:'CASCADE',
        cascade:['insert','update'],
        eager:true
    })
    @JoinColumn({name:'discount_id'})
    discount!:Discount
}