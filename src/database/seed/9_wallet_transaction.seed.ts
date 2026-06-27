import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";
import { Order } from "src/features/order/entities/order.entity";
import { OrderStatus } from "src/features/order/entities/order-status.enum";
import { User } from "src/features/user/entities/user.entity";


export default class WalletTransactionSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 WalletTransactionSeeder is running');

        const repository = manager.getRepository(WalletTransactions);
        const orderRepository = manager.getRepository(Order);

        const orders = await orderRepository.find({
            relations: {
                buyer: {
                    user: true
                },
                store: {
                    seller: {
                        user: true
                    }
                },
                job: {
                    driver: {
                        user: true
                    }
                }
            }
        });

        const transactions: Partial<WalletTransactions>[] = [
            {
                amount: 50_000_000,
                receiver: {
                    id: 1
                } as User,
                sender: {
                    id: 1
                } as User,
                description: "Top Up",
                type: WalletTransactionType.TOPUP
            }
        ];

        for (const order of orders) {

            // Buyer Payment
            transactions.push({
                type: WalletTransactionType.PAYMENT,
                amount: order.total_fee,
                description: `Payment for order #${order.id}`,
                order: {
                    id: order.id
                } as Order,
                sender: {
                    id: order.buyer.user.id
                } as User
            });

            // Seller & Driver receive payment only when order is DONE
            if (order.status === OrderStatus.DONE) {

                const driverAmount = order.delivery_fee;

                // As requested:
                // seller receives order price - delivery fee
                const sellerAmount = order.total_fee - order.delivery_fee;

                if (order.job.driver) {
                    transactions.push({
                        type: WalletTransactionType.PAYMENT,
                        amount: driverAmount,
                        description: `Delivery income for order #${order.id}`,
                        order: {
                            id: order.id
                        } as Order,
                        receiver: {
                            id: order.job.driver.user.id
                        } as User
                    });
                }

                transactions.push({
                    type: WalletTransactionType.PAYMENT,
                    amount: sellerAmount,
                    description: `Sales income for order #${order.id}`,
                    order: {
                        id: order.id
                    } as Order,
                    receiver: {
                        id: order.store.seller.user.id
                    } as User
                });
            }

            // Buyer refund when order returned
            if (order.status === OrderStatus.RETURN) {
                transactions.push({
                    type: WalletTransactionType.REFUND,
                    amount: order.total_fee,
                    description: `Auto refund overdue order #${order.id}`,
                    order: {
                        id: order.id
                    } as Order,
                    receiver: {
                        id: order.buyer.user.id
                    } as User
                });
            }
        }

        await repository.save(transactions);
    }
}