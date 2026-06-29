import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @IsString()
    receiver_name!:string

    @IsNotEmpty()
    @IsString()
    address_detail!:string

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

    // @IsNumber()
    // @Min(-90)
    // @Max(90)
    // latitude!: number;

    // @IsNumber()
    // @Min(-180)
    // @Max(180)
    // longitude!:number
}
