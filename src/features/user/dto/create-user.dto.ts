import { PublicUserRoles } from "src/common/utils"
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword} from "class-validator"
import { UserRole } from "../entities/role_user.enum"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    full_name!:string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!:string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength:8,
        minLowercase:0,
        minUppercase:0,
        minNumbers:0,
        minSymbols:0
    })
    password!:string

    @IsNotEmpty()
    @IsEnum(PublicUserRoles,{
        message: 'Role must be Driver, Buyer or Seller',
    })
    role!:UserRole
}
