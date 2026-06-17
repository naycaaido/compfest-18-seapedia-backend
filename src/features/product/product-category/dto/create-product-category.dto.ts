import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class CreateProductCategoryDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsOptional()
    @IsArray()
    @IsNumber({},{each:true})
    product_ids!: number[];
}
