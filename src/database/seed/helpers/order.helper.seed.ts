import { Job } from "src/features/job/entities/job.entity"
import { deliveryFee, DeliveryMethod } from "src/features/order/entities/delivery-method.enum"
import { OrderAddress } from "src/features/order/entities/order-address.entity"
import { OrderHistory } from "src/features/order/entities/order-history.entity"
import { OrderItem } from "src/features/order/entities/order-item.entity"
import { OrderProductTypeItem } from "src/features/order/entities/order-product-type-item.entity"
import { OrderProductType } from "src/features/order/entities/order-product-type.entity"
import { OrderStatus } from "src/features/order/entities/order-status.enum"
import { Order } from "src/features/order/entities/order.entity"

export function createOrderHistories(
    status: OrderStatus
): Partial<OrderHistory>[] {

    const histories: OrderStatus[] = [
        OrderStatus.PROCCESS
    ]

    if (status === OrderStatus.WAITING_DRIVER) {
        histories.push(OrderStatus.WAITING_DRIVER)
    }

    if (status === OrderStatus.ON_WAY) {
        histories.push(
            OrderStatus.WAITING_DRIVER,
            OrderStatus.ON_WAY
        )
    }

    if (status === OrderStatus.DONE) {
        histories.push(
            OrderStatus.WAITING_DRIVER,
            OrderStatus.ON_WAY,
            OrderStatus.DONE
        )
    }

    if (status === OrderStatus.RETURN) {
        histories.push(
            OrderStatus.WAITING_DRIVER,
            OrderStatus.ON_WAY,
            OrderStatus.RETURN
        )
    }

    return histories.map(it => ({
        status_order: it
    }))
}

export function createOrderTypeItems(
    itemIds: number[]
): Partial<OrderProductTypeItem>[] {

    return itemIds.map(id => ({
        item: {
            id
        } as any
    }))
}

export function createOrderType(
    typeId: number,
    itemIds: number[]
): Partial<OrderProductType> {

    return {

        type: {
            id: typeId
        } as any,

        orderProductTypeItems: createOrderTypeItems(itemIds) as OrderProductTypeItem[]

    }

}
export function createOrderItem(

    productId: number,

    quantity: number,

    subtotal: number,

    types: Partial<OrderProductType>[]

): Partial<OrderItem> {

    return {

        quantity,

        sub_total: subtotal,

        promo_discount: 0,

        product: {
            id: productId
        } as any,

        types: types as OrderProductType[]

    }
}

export function createJob(

    earning: number,

    driverId: number | null,

    done: boolean

): Partial<Job> {

    return {

        earning,

        expired_date: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),

        is_done: done,

        driver: driverId
            ? ({
                id: driverId
            } as any)
            : undefined

    }

}

interface CreateOrderParams {

    status: OrderStatus

    deliveryMethod: DeliveryMethod

    distance: number

    orderItems: Partial<OrderItem>[]

    subTotal: number

    driverId?: number

}
export function createOrder(
    params: CreateOrderParams
): Partial<Order> {

    const tax = 1000

    const delivery =
        deliveryFee(
            params.deliveryMethod,
            params.distance
        )

    return {

        delivery_method: params.deliveryMethod,

        distance_journey: params.distance,

        overdue: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),

        delivery_fee: delivery,

        tax_fee: tax,

        sub_total: params.subTotal,

        total_fee:
            params.subTotal +
            tax +
            delivery,

        voucher_discount: 0,

        status: params.status,

        buyer: {
            id: 1
        } as any,

        store: {
            id: 2
        } as any,

        orderAddress: {

            receiver_name: "User 1",

            receiver_phone_number: "+6282124805253",

            receiver_address:
                "RW 08, Pasar Manggis, Setiabudi, Jakarta Selatan",

            latitude: -6.2088171,

            longitude: 106.845592,

            buyer: {
                id: 1
            } as any

        } as OrderAddress,

        orderItems:
            params.orderItems as OrderItem[],

        orderHistories:
            createOrderHistories(
                params.status
            ) as OrderHistory[],

        job:
            createJob(

                delivery,

                params.driverId!,

                params.status ==
                    OrderStatus.DONE

            )as Job

    }

}