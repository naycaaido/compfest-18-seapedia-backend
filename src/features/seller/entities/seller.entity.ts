import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Store } from "src/features/store/entities/store.entity";

@Entity({name:"sellers"})
export class Seller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @OneToMany(() => Store, (store) => store.seller,{
        cascade:['insert']
    })
    store?:Store[]
    @RelationId((seller:Seller) => seller.store)
    store_id!:number

    @OneToOne(() => User, (user) => user.seller,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:"user_id"})
    user!:User
}

