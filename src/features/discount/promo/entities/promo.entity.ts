import { BaseEntity } from "src/common/base_entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Discount } from "../../discount/entities/discount.entity";
import { Expose } from "class-transformer";
import { Product } from "src/features/product/product/entities/product.entity";

@Entity({name:'promos'})
export class Promo extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(() => Discount, discount => discount.promo,{
        onDelete:'CASCADE',
        cascade:['insert','update'],
    })
    @JoinColumn({name:"discount_id"})
    discount!:Discount

    @Expose({name:"products"})
    @OneToMany(() => Product, products => products.promo,{
        cascade:['insert','update','soft-remove','remove']
    })
    products!: Product[]
}