import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator"
import { CreateProductTypeFromProductDto } from "../../product-type/dto/create-product-type.dto"

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    price!:number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock!:number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    category_id?:number

    @IsOptional()
    @IsArray()
    @ValidateNested({each:true})
    @Type(() => CreateProductTypeFromProductDto)
    types!: CreateProductTypeFromProductDto[]
}