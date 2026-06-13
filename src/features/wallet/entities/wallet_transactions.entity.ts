import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./wallet.entity";
import { WalletTransactionType } from "./wallet_transaction_type.enum";
import { User } from "src/features/user/entities/user.entity";

@Entity({name:"wallet_transactions"})
export class WalletTransactions{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"enum",enum:WalletTransactionType})
    type!:WalletTransactionType

    @Column({type:"int"})
    amount!:number

    @Column({type:"varchar",length:255})
    description!:string

    @ManyToOne(() => User)
    @JoinColumn({name:'sender_id'})
    sender!:User

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver!: User;

    @ManyToOne(() => Wallet, wallet => wallet.transactions)
    @JoinColumn({name:'wallet_id'})
    wallet!:Wallet
}