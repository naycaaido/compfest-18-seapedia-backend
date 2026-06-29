import { BaseEntity } from "src/common/base_entity";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Province, City, District, Village } from "src/features/store/entities/region.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"address"})
export class Address extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"varchar",length:255})
    receiver_name!:string

    @Column({type:"text"})
    address_detail!:string

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

    @ManyToOne(() => Buyer, buyer => buyer.addresses,{
        onDelete:'CASCADE',
        cascade:['insert','update']
    })
    @JoinColumn({name:"buyer_id"})
    buyer!:Buyer
}
