import { IsOptional, IsString } from "class-validator"

export class FindProductBySellerDto{
    @IsOptional()
    @IsString()
    name?:string
}