import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { ProductTypeItem } from "../../product-type-item/entities/product-type-item.entity";
import { Expose } from "class-transformer";

@Entity({name:"product_types"})
export class ProductType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"boolean",default:false})
    is_multiple!:boolean

    @Column({type:"boolean",default:true})
    is_required!:boolean

    @OneToMany(() => ProductTypeItem, productTypeItem => productTypeItem.type,{
        cascade:['insert','update']
    })
    items!:ProductTypeItem[]

    @ManyToOne(() => Product, product => product.types,{
        onDelete:'CASCADE'
    })
    @Expose({name:'product_id'})
    @Index('idx_product_type_product_id')
    @JoinColumn({name:"product_id"})
    product!:Product
}
