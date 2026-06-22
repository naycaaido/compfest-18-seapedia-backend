import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order-status.enum';

export class UpdateOrderDto{
    @IsNotEmpty()
    @IsEnum([OrderStatus.WAITING_DRIVER],{
        message: `Order Status must be one of: Menunggu Pengirim`,
    })
    order_status!:OrderStatus
}
