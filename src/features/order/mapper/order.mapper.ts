
import { Payload } from "src/common/utils"
import { Cart } from "src/features/cart/cart/entities/cart.entity"
import { Store } from "src/features/store/entities/store.entity"
import { DeepPartial } from "typeorm"
import { DeliveryMethod } from "../entities/delivery-method.enum"
import { Order } from "../entities/order.entity"
import { Address } from "src/features/address/entities/address.entity"
import { OrderStatus } from "../entities/order-status.enum"

export function mapToOrder(
  payload: Payload,
  cart: Cart,
  store: Store,
  address: Address,
  deliveryMethod: DeliveryMethod,
  deliveryFee: number,
  distanceKm: number,
  subTotal: number,
  taxFee:number,
  totalFee: number,
  statusOrder:OrderStatus,
  overdue: Date,
): DeepPartial<Order> {

  return {
    delivery_fee: deliveryFee,
    sub_total: subTotal,
    tax_fee:taxFee,
    total_fee: totalFee,
    delivery_method: deliveryMethod,
    distance_journey: distanceKm,
    overdue,
    status: statusOrder,
    orderHistories:[
        {
           status_order:statusOrder
        }
    ],

    orderAddress: {
      latitude: address.latitude,
      longitude: address.longitude,
      receiver_address: address.address_detail,
      receiver_name: address.receiver_name,
      receiver_phone_number: cart.buyer.phone_number,
    },

    buyer: {
      id: payload.userRoleId
    },

    store: {
      id: store.id,
      seller:{
        id:store.seller.id
      }
    },

    orderItems: cart.cartItems.map(cartItem => ({
      promo_discount: cartItem.product.promo != undefined ?
      cartItem.product.price * (cartItem.product.promo.discount.discount_percantage / 100) : 0,

      promo:cartItem.product.promo ?? undefined,

      product: {
        id: cartItem.product.id
      },

      quantity: cartItem.quantity,

      sub_total: cartItem.sub_total,
      types: cartItem.cartProductTypes.map(typeCart => ({
        type: {
          id: typeCart.productType.id
        },

        orderProductTypeItems:
          typeCart.cartProductTypeItems.map(itemCart => ({
            item: {
              id: itemCart.productTypeItem.id
            }
          }))
      }))
    }))
  }
}