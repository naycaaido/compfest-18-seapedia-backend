import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { PublicUserRoles } from "src/common/utils"
import { UserRole } from "../entities/role_user.enum"

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!:string

    @IsNotEmpty()
    @IsString()
    password!:string

    @IsNotEmpty()
    @IsEnum(UserRole,{
        message: 'Role must be Driver, Admin, Buyer or Seller',
    })
    role!:UserRole
}