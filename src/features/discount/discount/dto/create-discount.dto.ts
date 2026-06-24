import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { DiscountType } from "../entities/discount-type.enum";
import { Type } from "class-transformer";

export class CreateDiscountDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount_percantage!:number

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    remaining_usage!:number

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    expired_date!: Date;
}
