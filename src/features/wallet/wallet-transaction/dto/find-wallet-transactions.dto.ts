import { IsOptional, IsEnum } from "class-validator"
import { WalletTransactionType } from "../entities/wallet-transaction-type.enum"

export class FindWalletTransactionDto{

    @IsOptional()
    @IsEnum(WalletTransactionType,{
        message: 'Wallet transaction type must be Top Up, Payment and Refund',
    })
    wallet_transaction_type?:WalletTransactionType
}