import { BaseEntity } from "src/common/base_entity";
import { Store } from "src/features/store/entities/store.entity";
import { Column, Entity, PrimaryGeneratedColumn,Check, OneToMany, ManyToOne, JoinColumn, Index, RelationId, OneToOne } from "typeorm";
import { ProductCategory } from "../../product-category/entities/product-category.entity";
import { ProductImage } from "../../product-image/entities/product-image.entity";
import { ProductType } from "../../product-type/entities/product-type.entity";
import { OrderItem } from "src/features/order/entities/order-item.entity";
import { Expose } from "class-transformer";
import { Promo } from "src/features/discount/promo/entities/promo.entity";

@Entity({name:"products"})
@Index('idx_product_store_type', ['store', 'category'])
@Check(`"stock" >= 0`)
@Check(`"price" >= 0`)
export class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"int",default:0})
    price!:number

    @Column({type:"int",default:0})
    stock!:number

    @Column({
        type: "boolean",
        generatedType: "STORED",
        asExpression: `CASE WHEN stock = 0 THEN false ELSE true END`,
    })
    is_available!:boolean

    @ManyToOne(() => Promo,{
        nullable:true,
        onDelete:'SET NULL'
    })
    @JoinColumn({name:'promo_id'})
    promo?:Promo

    @OneToMany(() => ProductImage, productImage => productImage.product,{
        cascade:true
    })
    images!:ProductImage[]

    @OneToMany(() => ProductType, productType => productType.product,{
        cascade:true
    })
    types!:ProductType[]

    @OneToMany(() => OrderItem, orderItems => orderItems.product)
    orderItems!:OrderItem[]

    @Index("idx_product_store_id")
    @ManyToOne(() => Store, store => store.products,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:"store_id"})
    store!:Store

    @Index("idx_product_product_category_id")
    @ManyToOne(() => ProductCategory, category => category.products,)
    @JoinColumn({name:"category_id"})
    category!:ProductCategory
}
