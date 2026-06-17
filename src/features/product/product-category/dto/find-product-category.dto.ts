import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindProductCategoryDto{
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    product_id?:number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    store_id?:number
}