import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { WalletTransactionType } from "../entities/wallet-transaction-type.enum";

export class CreateWalletTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    amount!:number
}
