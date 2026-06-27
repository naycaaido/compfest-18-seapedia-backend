import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Order } from "src/features/order/entities/order.entity";
import { deliveryFee, DeliveryMethod } from "src/features/order/entities/delivery-method.enum";
import { OrderStatus } from "src/features/order/entities/order-status.enum";
import { Buyer } from "src/features/buyer/entities/buyer.entity";
import { Store } from "src/features/store/entities/store.entity";
import { OrderAddress } from "src/features/order/entities/order-address.entity";
import { createOrder, createOrderItem, createOrderType } from "./helpers/order.helper.seed";


export default class OrderSeeder implements Seeder {

    async run(manager: EntityManager): Promise<any> {

        console.log("🔥 OrderSeeder is running")

        const repository = manager.getRepository(Order)

        await repository.save([

            // ===========================
            // PROCESS
            // ===========================
            createOrder({

                status: OrderStatus.PROCCESS,

                deliveryMethod: DeliveryMethod.REGULAR,

                distance: 5,

                subTotal: 12_120_000,

                orderItems: [

                    createOrderItem(
                        4,
                        1,
                        12_100_000,
                        [
                            createOrderType(4, [7]),
                            createOrderType(5, [9])
                        ]
                    ),

                    createOrderItem(
                        6,
                        1,
                        20_000,
                        [
                            createOrderType(6, [11])
                        ]
                    )

                ]

            }),

            // ===========================
            // WAITING DRIVER
            // ===========================
            createOrder({

                status: OrderStatus.WAITING_DRIVER,

                deliveryMethod: DeliveryMethod.INSTANT,

                distance: 2,

                subTotal: 2_820_000,

                orderItems: [

                    createOrderItem(
                        5,
                        1,
                        2_720_000,
                        []
                    ),

                    createOrderItem(
                        6,
                        5,
                        100_000,
                        [
                            createOrderType(6, [12])
                        ]
                    )

                ]

            }),

            // ===========================
            // ON WAY
            // ===========================
            createOrder({

                status: OrderStatus.ON_WAY,

                deliveryMethod: DeliveryMethod.NEXT_DAY,

                distance: 6,

                driverId: 1,

                subTotal: 12_100_000,

                orderItems: [

                    createOrderItem(
                        4,
                        1,
                        12_100_000,
                        [
                            createOrderType(4, [8]),
                            createOrderType(5, [10])
                        ]
                    )

                ]

            }),

            // ===========================
            // DONE
            // ===========================
            createOrder({

                status: OrderStatus.DONE,

                deliveryMethod: DeliveryMethod.REGULAR,

                distance: 4,

                driverId: 1,

                subTotal: 12_120_000,

                orderItems: [

                    createOrderItem(
                        4,
                        1,
                        12_100_000,
                        [
                            createOrderType(4, [7]),
                            createOrderType(5, [9])
                        ]
                    ),

                    createOrderItem(
                        6,
                        1,
                        20_000,
                        [
                            createOrderType(6, [13])
                        ]
                    )

                ]

            }),

            // ===========================
            // RETURN
            // ===========================
            createOrder({

                status: OrderStatus.RETURN,

                deliveryMethod: DeliveryMethod.INSTANT,

                distance: 3,

                driverId: 1,

                subTotal: 2_741_000,

                orderItems: [

                    createOrderItem(
                        5,
                        1,
                        2_720_000,
                        []
                    ),

                    createOrderItem(
                        6,
                        1,
                        21_000,
                        [
                            createOrderType(6, [11])
                        ]
                    )

                ]

            })

        ])

    }

}