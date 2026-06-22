import { IsEnum, IsOptional} from "class-validator";
import { OrderStatus } from "../entities/order-status.enum";

export class FindOrderDto{
    @IsOptional()
    @IsEnum(OrderStatus,{
        message: `Order Status must be one of: ${Object.values(OrderStatus).join(', ')}`,
    })
    order_status!:OrderStatus
}
