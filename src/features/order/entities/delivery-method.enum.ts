export enum DeliveryMethod {
  INSTANT = 'Instant',
  NEXT_DAY = 'Next Day',
  REGULAR = 'Regular'
}

export function deliveryFee(
  deliveryMethod: DeliveryMethod,
  distanceKm: number
): number {
  switch (deliveryMethod) {
    case DeliveryMethod.INSTANT:
      return 10_000 + (3_000 * Math.ceil(distanceKm))

    case DeliveryMethod.NEXT_DAY:
      return 7_000 + (1_500 * Math.ceil(distanceKm))

    case DeliveryMethod.REGULAR:
      return 5_000 + (1_000 * Math.ceil(distanceKm))

    default:
      return 0
  }
}