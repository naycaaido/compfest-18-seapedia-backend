import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class AddRoleUserDto extends PickType(CreateUserDto,['role'] as const) {}