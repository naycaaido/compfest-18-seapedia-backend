import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WalletTransactionType } from "./wallet-transaction-type.enum";
import { User } from "src/features/user/entities/user.entity";

@Entity({name:"wallet_transactions"})
@Index('idx_wallet_transactions_receiver_sender', ['receiver', 'sender'])
@Index('idx_wallet_transactions_receiver_type', ['receiver', 'type'])
@Index('idx_wallet_transactions_sender_type', ['sender', 'type'])
export class WalletTransactions{
    @PrimaryGeneratedColumn()
    id!:number

    @Index("wallet_transaction_type")
    @Column({type:"enum",enum:WalletTransactionType})
    type!:WalletTransactionType

    @Column({type:"int"})
    amount!:number

    @Column({type:"varchar",length:255})
    description!:string

    @Index("idx_wallet_transaction_sender_id")
    @ManyToOne(() => User)
    @JoinColumn({name:'sender_id'})
    sender!:User

    @Index("idx_wallet_transaction_receiver_id")
    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id'})
    receiver?: User;
}