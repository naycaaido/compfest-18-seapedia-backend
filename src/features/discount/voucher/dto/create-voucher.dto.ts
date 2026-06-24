import { IsNotEmpty, IsString } from "class-validator";
import { CreateDiscountDto } from "../../discount/dto/create-discount.dto";

export class CreateVoucherDto extends CreateDiscountDto{
    @IsNotEmpty()
    @IsString()
    code!:string
}