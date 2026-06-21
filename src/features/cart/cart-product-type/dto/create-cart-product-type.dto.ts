import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"
import { CreateCartProductTypeItemDto } from "../../cart-product-type-item/dto/create-cart-product-type-item.dto"

export class CreateCartProductTypeDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    product_type_id!:number
    
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each:true})
    @Type(() => CreateCartProductTypeItemDto)
    items!: CreateCartProductTypeItemDto[]   
}
