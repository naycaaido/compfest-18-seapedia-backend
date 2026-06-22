import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class ChangeUserRoleDto extends PickType(CreateUserDto,['role']){}