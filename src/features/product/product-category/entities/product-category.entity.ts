import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Seller } from "src/features/seller/entities/seller.entity";

@Entity({name:"product_categories"})
export class ProductCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @ManyToOne(() => Seller)
    @JoinColumn({name:"seller_id"})
    seller!:Seller

    @OneToMany(() => Product, products => products.category)
    products!:Product[]
}
