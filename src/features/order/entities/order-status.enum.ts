import { ForbiddenException } from "@nestjs/common"
import { exceptionMessage, ExceptionType } from "src/common/exception"

export enum OrderStatus {
  PROCCESS = 'Sedang Dikemas',
  WAITING_DRIVER = 'Menunggu Pengirim',
  ON_WAY = 'Sedang Dikirim',
  RETURN = 'Dikembalikan',
  DONE = 'Pesanan Selesai'
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PROCCESS]: [
        OrderStatus.WAITING_DRIVER,
        OrderStatus.RETURN
    ],

    [OrderStatus.WAITING_DRIVER]: [
        OrderStatus.ON_WAY
    ],

    [OrderStatus.ON_WAY]: [
        OrderStatus.DONE,
        OrderStatus.RETURN
    ],
    [OrderStatus.RETURN]: [],
    [OrderStatus.DONE]: []
}

export function updateStatus(
  current: OrderStatus,
  next: OrderStatus
): OrderStatus {

  if (!transitions[current]?.includes(next)) {
    throw new ForbiddenException(
      exceptionMessage(
        ExceptionType.FORBIDDEN,
        "Status Change"
      )
    )
  }

  return next
}

