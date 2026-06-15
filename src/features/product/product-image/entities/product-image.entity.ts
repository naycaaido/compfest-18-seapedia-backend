import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Exclude, Expose } from "class-transformer";

@Entity({name:"product_images"})
export class ProductImage extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"text",unique:true,nullable:true})
    @Exclude()
    image_id?:string | undefined
    
    @Expose()
    get image_url(): string | null {
        return this.image_id
        ? `${process.env.BASE_URL}/${this.image_id}`
        : null;
    }

    @ManyToOne(() => Product, product => product.images,{
        onDelete:'CASCADE'
    })
    @Index('idx_product_images_product_id')
    @JoinColumn({name:"product_id"})
    product!:Product
}
