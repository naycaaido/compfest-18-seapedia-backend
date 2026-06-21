import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class AllQueryReviewDto{
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit!:number
}