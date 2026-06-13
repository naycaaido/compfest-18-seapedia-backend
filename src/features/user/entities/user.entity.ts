import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "./user_role.entity";
import { Buyer } from "../../buyer/entities/buyer.entity";
import { Seller } from "../../seller/entities/seller.entity";
import { Driver } from "../../driver/entities/driver.entity";
import { Admin } from "../../admin/entities/admin.entity";
import { Exclude } from "class-transformer";
import { Wallet } from "src/features/wallet/entities/wallet.entity";


@Entity({name:"users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({type:"varchar",length:255})
    full_name!: string;

    @Column({type:"varchar",length:255,unique:true})
    email!: string;

    @Exclude()
    @Column({type:"text"})
    password!: string;

    @OneToMany(() => UserRoles, userRoles => userRoles.user,{
        cascade:['insert',"update"],
    })
    roles!:UserRoles[]

    @OneToOne(() => Wallet, wallet => wallet.user,{
        cascade: ['insert','update'],
    })
    wallet!:Wallet

    @OneToOne(() => Buyer, buyer => buyer.user,{
        cascade:['insert'],
        onDelete:'CASCADE'
    })
    buyer?:Buyer|null

    @OneToOne(() => Seller, seller => seller.user,{
        cascade:['insert'],
        onDelete:'CASCADE'
    })
    seller?:Seller|null

    @OneToOne(() => Driver, driver => driver.user,{
        cascade:['insert'],
        onDelete:'CASCADE'
    })
    driver?:Driver|null

    @OneToOne(() => Admin, admin => admin.user,{
        cascade:['insert'],
        onDelete:'CASCADE'
    })
    admin?:Admin|null
}
