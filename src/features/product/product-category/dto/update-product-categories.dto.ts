import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateProductCategoryDto } from "./create-product-category.dto";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

export class UpdateProductCategoriesDto extends PartialType(CreateProductCategoryDto){}