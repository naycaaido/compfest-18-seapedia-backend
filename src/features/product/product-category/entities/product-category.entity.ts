import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity({name:"product_categories"})
export class ProductCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @OneToMany(() => Product, products => products.category)
    products!:Product[]
}
