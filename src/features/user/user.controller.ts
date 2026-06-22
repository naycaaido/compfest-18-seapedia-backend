import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { instanceToPlain } from 'class-transformer';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from './entities/role_user.enum';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { AddRoleUserDto } from './dto/add-role-user.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';

@UserRoleDecorator(UserRole.BUYER,UserRole.DRIVER,UserRole.SELLER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,"account"))
  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(this.userService.create(createUserDto));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,"login"))
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return instanceToPlain(this.userService.login(loginUserDto));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.ADD,"role"))
  @Post('roles')
  async addRoles(
    @PayloadJWT() payload:Payload,
    @Body() addRoleUser: AddRoleUserDto
  ) {
    return instanceToPlain(this.userService.saveRoles(payload.email,addRoleUser.role));
  }

  @UserRoleDecorator(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,"user"))
  @UserRoleDecorator(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return instanceToPlain(this.userService.findOne(+id));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,"user"))
  @Get('profile')
  getProfile(
    @PayloadJWT() payload:Payload
  ) {
    return instanceToPlain(this.userService.getProfile(payload.sub));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,"change role"))
  @Post('change-role')
  changeRole(
    @PayloadJWT() payload:Payload,
    @Body() dto:ChangeUserRoleDto
  ) {
    return this.userService.changeRoleCurrent(payload,dto);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @UserRoleDecorator(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @PayloadJWT() payload:Payload,
    @Param('id') id: string) {
    return this.userService.remove(+id,payload);
  }
}
