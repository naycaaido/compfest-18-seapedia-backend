import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscountType } from "./discount-type.enum";
import { Voucher } from "../../voucher/entities/voucher.entity";
import { Promo } from "../../promo/entities/promo.entity";
import { DiscountUsage } from "./discount-usage.entity";

@Entity({name:"discounts"})
export class Discount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:'varchar',length:255})
    name!:string

    @Column({type:'smallint'})
    discount_percantage!:number

    @Column({type:'enum', enum:DiscountType})
    type!:DiscountType

    @Column({type:'int'})
    remaining_usage!:number

    @Column({type:'timestamp'})
    expired_date!:Date

    @Column({ type:'int',default: 1 })
    max_usage_per_user!: number;

    @OneToOne(() => Voucher, voucher => voucher.discount,{
        cascade:['insert']
    })
    voucher?:Voucher

    @OneToMany(() => Promo, promo => promo.discount,{
        cascade:['insert']
    })
    promo?:Promo

    @OneToMany(() => DiscountUsage, discountUsage => discountUsage.discount)
    discountUsages!:DiscountUsage[]
}
