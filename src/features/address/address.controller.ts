import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';

@UserRoleDecorator(UserRole.BUYER)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Address'))
  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.addressService.create(createAddressDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Addresses'))
  @Get()
  findAll(
    @PayloadJWT() payload:Payload
  ) {
    return this.addressService.findAll(payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Address'))
  @Get('active')
  findActive(
    @PayloadJWT() payload:Payload
  ) {
    return this.addressService.findActive(payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Address'))
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.addressService.findOne(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Address'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @PayloadJWT() payload:Payload

  ) {
    return this.addressService.update(+id, updateAddressDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Address'))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.addressService.remove(+id,payload);
  }
}
