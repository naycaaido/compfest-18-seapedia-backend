import { PickType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateProductTypeItemFromProductDto } from "../../product-type-item/dto/create-product-type-item.dto";

export class CreateProductTypeDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    product_id!:number

    @IsNotEmpty()
    @Type(() => Boolean)
    @IsBoolean()
    is_multiple!:boolean

    @IsNotEmpty()
    @Type(() => Boolean)
    @IsBoolean()
    is_required!:boolean

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each:true})
    @Type(() => CreateProductTypeItemFromProductDto)
    items!: CreateProductTypeItemFromProductDto[]
}

export class CreateProductTypeFromProductDto extends PickType(CreateProductTypeDto,['name','is_multiple','is_required','items']) {}
