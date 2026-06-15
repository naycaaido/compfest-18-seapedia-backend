import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/common/base_entity";
import { Product } from "src/features/product/product/entities/product.entity";
import { Seller } from "src/features/seller/entities/seller.entity";
import { AfterSoftRemove, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"stores"})
export class Store extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:100})
    name!:string

    @Column({type:"text"})
    address!:string

    @Column({type:"varchar",length:"20"})
    phone_number!:string

    @Column({type:"text",unique:true,nullable:true})
    @Exclude()
    image_id?:string | undefined

    @Expose()
    get image_url(): string | null {
        return this.image_id
        ? `${process.env.BASE_URL}/${this.image_id}`
        : null;
    }

    @Column('decimal', {
    precision: 10,
    scale: 8,
    nullable:true
    })
    latitude?: number;

    @Column('decimal', {
    precision: 11,
    scale: 8,
    nullable:true
    })
    longitude?: number;

    @ManyToOne(() => Seller, seller => seller.store,{
        onDelete:"CASCADE",
    })
    @Expose({name:"seller_id"})
    @JoinColumn({name:"seller_id"})
    seller!:Seller
    
    @OneToMany(() => Product, products => products.store,{
    })
    products!:Product[]
}
