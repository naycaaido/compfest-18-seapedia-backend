import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, Min } from "class-validator"

export class CreateStoreDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @IsString()
    address!:string

    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!:string

    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    latitude!: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    longitude!:number
}
