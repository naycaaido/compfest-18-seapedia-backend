import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { DiscountType } from "../entities/discount-type.enum";
import { Type } from "class-transformer";

export class FindDiscountDto{
    @IsOptional()
    @IsEnum(DiscountType,{
        message: `discount_type must be one of: ${Object.values(DiscountType).join(', ')}`,
    })
    discount_type!:DiscountType

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    showing_expired!:boolean
}