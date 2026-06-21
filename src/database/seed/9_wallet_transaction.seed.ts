import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";


export default class WalletTransactionSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 WalletTransactionSeeder is running');
        const repository = manager.getRepository(WalletTransactions)
        await repository.save([
            {
                amount: 40_000,
                receiver:{
                    id:1
                },
                sender:{
                    id:1
                },
                description:"Top Up",
                type:WalletTransactionType.TOPUP
            }
        ])
    }
}