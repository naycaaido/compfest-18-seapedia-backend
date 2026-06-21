import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    reviewer_name!:string

    @IsNotEmpty()
    @IsString()
    comment!:string
    
    @IsOptional()
    @IsInt()
    user_id?:number

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating!:number
}
