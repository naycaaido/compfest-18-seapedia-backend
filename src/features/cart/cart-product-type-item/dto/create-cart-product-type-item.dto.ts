import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartProductTypeItemDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    product_type_item_id!:number
}
