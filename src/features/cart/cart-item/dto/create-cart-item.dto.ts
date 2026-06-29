import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, ValidateNested } from "class-validator"
import { CreateCartProductTypeDto } from "../../cart-product-type/dto/create-cart-product-type.dto"

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    product_id!:number
    
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantity!:number
        
    @IsArray()
    @ValidateNested({each:true})
    @Type(() => CreateCartProductTypeDto)
    types!: CreateCartProductTypeDto[]   
}
