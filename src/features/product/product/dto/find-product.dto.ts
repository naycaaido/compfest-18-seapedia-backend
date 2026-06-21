import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class FindProductDto{
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    store_id?:number

    @IsOptional()
    @IsString()
    name?:string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?:number
}