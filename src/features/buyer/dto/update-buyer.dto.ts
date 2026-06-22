import { IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateBuyerDto{
    @IsOptional()
    @IsPhoneNumber()
    phone_number!:string

    @IsOptional()
    @IsNumber()
    active_address_id!:number
}
