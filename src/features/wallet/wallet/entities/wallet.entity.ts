import { User } from "src/features/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WalletTransactions } from "../../wallet-transaction/entities/wallet-transaction.entity";

@Entity({name:"wallets"})
export class Wallet {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({name:"balance",default:0,type:"int"})
    balance!:number

    @OneToMany(() => WalletTransactions, walletTransactions => walletTransactions.wallet)
    transactions!:WalletTransactions[]

    @OneToOne(() => User, (user) => user.wallet,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'user_id'})
    user!:User
}
