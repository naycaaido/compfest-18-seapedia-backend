import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, Min } from "class-validator";
import { CreateDiscountDto } from "../../discount/dto/create-discount.dto";
import { Type } from "class-transformer";
import { OmitType } from "@nestjs/mapped-types";


export class CreatePromoDto extends OmitType(CreateDiscountDto,['remaining_usage']){
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    product_ids!:number[]
}