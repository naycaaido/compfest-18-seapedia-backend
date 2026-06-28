import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";
import { Order } from "src/features/order/entities/order.entity";
import { OrderStatus } from "src/features/order/entities/order-status.enum";
import { User } from "src/features/user/entities/user.entity";
import { Wallet } from "src/features/wallet/wallet/entities/wallet.entity";


export default class WalletTransactionSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log("🔥 WalletTransactionSeeder is running");

        const transactionRepository = manager.getRepository(WalletTransactions);
        const walletRepository = manager.getRepository(Wallet);
        const orderRepository = manager.getRepository(Order);

        const orders = await orderRepository.find({
            relations: {
                buyer: {
                    user: {
                        wallet: true
                    }
                },
                store: {
                    seller: {
                        user: {
                            wallet: true
                        }
                    }
                },
                job: {
                    driver: {
                        user: {
                            wallet: true
                        }
                    }
                }
            }
        });

        const TOPUP_AMOUNT = 100_000_000;

        const transactions: Partial<WalletTransactions>[] = [
            {
                type: WalletTransactionType.TOPUP,
                amount: TOPUP_AMOUNT,
                description: "Initial Top Up",
                receiver: {
                    id: 1
                } as User
            }
        ];

        for (const order of orders) {

            // Buyer pays
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

            // Order completed
            if (order.status === OrderStatus.DONE) {

                const driverAmount = order.delivery_fee;

                // Adjust this if your business rule changes
                const sellerAmount =
                    order.total_fee - order.delivery_fee;

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

            // Refunded order
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

        await transactionRepository.save(transactions);

        // ----------------------------------------
        // Calculate every wallet balance
        // ----------------------------------------

        const balanceMap = new Map<number, number>();

        for (const transaction of transactions) {

            switch (transaction.type) {

                case WalletTransactionType.TOPUP: {
                    const receiverId = transaction.receiver!.id;

                    balanceMap.set(
                        receiverId,
                        (balanceMap.get(receiverId) ?? 0) +
                            transaction.amount!
                    );
                    break;
                }

                case WalletTransactionType.PAYMENT: {

                    if (transaction.sender) {

                        const senderId = transaction.sender.id;

                        balanceMap.set(
                            senderId,
                            (balanceMap.get(senderId) ?? 0) -
                                transaction.amount!
                        );
                    }

                    if (transaction.receiver) {

                        const receiverId = transaction.receiver.id;

                        balanceMap.set(
                            receiverId,
                            (balanceMap.get(receiverId) ?? 0) +
                                transaction.amount!
                        );
                    }

                    break;
                }

                case WalletTransactionType.REFUND: {

                    const receiverId = transaction.receiver!.id;

                    balanceMap.set(
                        receiverId,
                        (balanceMap.get(receiverId) ?? 0) +
                            transaction.amount!
                    );

                    break;
                }
            }
        }

        await Promise.all(
            [...balanceMap.entries()].map(([userId, balance]) =>
                walletRepository.update(
                    {
                        user: {
                            id: userId
                        }
                    },
                    {
                        balance
                    }
                )
            )
        );
    }
}