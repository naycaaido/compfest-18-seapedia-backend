import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateBuyerDto {
    @IsNotEmpty()
    @IsNumber()
    user_id!:number
}
