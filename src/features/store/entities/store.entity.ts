import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/common/base_entity";
import { Order } from "src/features/order/entities/order.entity";
import { Product } from "src/features/product/product/entities/product.entity";
import { Seller } from "src/features/seller/entities/seller.entity";
import { AfterSoftRemove, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { City, District, Province, Village } from "./region.entity";

@Entity({name:"stores"})
@Index('idx_store_phone_active',['phone_number'],{ unique: true, where: `"deleted_at" IS NULL` })
@Index('idx_store_name_active',['name'],{ unique: true, where: `"deleted_at" IS NULL` })
@Index('idx_store_seller_active',['seller'],{ unique: true, where: `"deleted_at" IS NULL` })
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

    @ManyToOne(() => Province,{
        cascade:['insert'],
    })
    province!:Province

    @ManyToOne(() => City,{
        cascade:['insert'],
    })
    city!:City

    @ManyToOne(() => District,{
        cascade:['insert'],
    })
    district!:District

    @ManyToOne(() => Village,{
        cascade:['insert'],
    })
    village!:Village
    
    @OneToMany(() => Product, products => products.store,{
    })
    products!:Product[]

    @OneToMany(() => Order, orders => orders.store,{
    })
    orders!:Order[]
}
