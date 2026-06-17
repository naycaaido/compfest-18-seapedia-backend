import { BaseEntity } from "src/common/base_entity";
import { Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductType } from "../../product-type/entities/product-type.entity";

@Entity({name:"product_type_items"})
@Check(`stock >= 0`)
@Check(`price >= 0`)
export class ProductTypeItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"int",default:0})
    stock!:number

    @Column({type:"int",default:0})
    price!:number

    @ManyToOne(() => ProductType, productType => productType.items,{
        onDelete:'CASCADE'
    })
    @Index("idx_product_type_item_product_type_id")
    @JoinColumn({name:'product_type_id'})
    type!:ProductType
}
