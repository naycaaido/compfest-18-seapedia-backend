import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Public } from 'src/decorators/public.decorator';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';
import { MultipartInterceptor } from 'src/interceptors/multipart.interceptor';
import { MultipartData } from 'src/decorators/multipart-data.decorator';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UserRoleDecorator(UserRole.SELLER)
  @UseInterceptors(new MultipartInterceptor('store_image',CreateStoreDto))
  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'store'))
  @Post()
  create(
    @PayloadJWT() payload:Payload,
    @MultipartData('store_image') {dto,file},
  ) {
    return this.storeService.create(payload.userRoleId,dto,file?.[0] ?? null);
  }

  @Public()
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'store'))
  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @UserRoleDecorator(UserRole.SELLER)
  @Get('seller')
  findOneByPayload(
    @PayloadJWT() payload:Payload
  ) {
    return this.storeService.findOneByPayload(payload);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'store'))
  @UserRoleDecorator(UserRole.SELLER,UserRole.ADMIN)
  @Delete()
  remove(
    @PayloadJWT() payload:Payload,
  ) {
    return this.storeService.remove(payload.userRoleId);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,'permanently remove the store'))
  @UserRoleDecorator(UserRole.SELLER,UserRole.ADMIN)
  @Delete(':id')
  permanentnDelete(
    @PayloadJWT() payload:Payload,
    @Param('id') id: string) {
    return this.storeService.permanentDelete(+id,payload);
  }
}
