import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Discount } from "./discount.entity";

@Index('idx_discount_usage_buyer_discount_unique',['buyer', 'discount'],{ unique: true })
@Entity({name:'discount_usages'})
export class DiscountUsage extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({ default: 0 })
    usage_count!: number

    @ManyToOne(() => Buyer, buyer => buyer.discountUsages,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'buyer_id'})
    buyer!:Buyer

    @ManyToOne(() => Discount, discount => discount.discountUsages,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'discount_id'})
    discount!:Discount
}