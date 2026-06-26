import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Matches, Max, Min } from "class-validator"

export class CreateStoreDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @IsString()
    address!:string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    province_id!:number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    city_id!:number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    district_id!:number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    village_id!:number

    @IsNotEmpty()
    @IsString()
    province!:string

    @IsNotEmpty()
    @IsString()
    city!:string

    @IsNotEmpty()
    @IsString()
    district!:string

    @IsNotEmpty()
    @IsString()
    village!:string

    @IsNotEmpty()
    @Matches(/^\+62\d{8,13}$/, {
    message: 'Phone number must start with +62 and contain 8 to 13 digits after it.',
    })
    phone_number!:string
}
