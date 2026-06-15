

import { OmitType, PickType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductTypeItemDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    product_type_id!:number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock!:number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!:number
}

export class CreateProductTypeItemFromProductDto extends OmitType(CreateProductTypeItemDto,['product_type_id']) {}
