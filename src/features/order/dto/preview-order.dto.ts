import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DeliveryMethod } from "../entities/delivery-method.enum";

export class PreviewOrderDto{
    @IsNotEmpty()
    @IsEnum(DeliveryMethod,{
        message: 'Delivery Method must be Instant, Next Day or Regular',
    })
    delivery_method!:DeliveryMethod

    @IsNotEmpty()
    @IsNumber()
    address_id!:number

    @IsOptional()
    @IsString()
    voucher_code?:string
}