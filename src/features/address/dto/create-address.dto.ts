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

    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude!: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude!:number
}
