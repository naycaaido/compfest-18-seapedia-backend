import { ArrayNotEmpty, IsArray, IsNumber, IsString } from "class-validator";

export class RemoveProductImageDto{

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({},{each:true})
    product_image_ids!: number[];
}