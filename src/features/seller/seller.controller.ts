import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { StoreService } from '../store/store.service';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';

@UserRoleDecorator(UserRole.SELLER)
@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly storeService:StoreService
  ) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @Get('products')
  findAll(
    @PayloadJWT() payload:Payload,
  ) {
    return this.sellerService.findAllProducts(payload);
  }

  @Get('store')
  findOneByPayload(
    @PayloadJWT() payload:Payload
  ) {
    return this.storeService.findOneByPayload(payload);
  }

  @Get('store-check')
  checkStore(
    @PayloadJWT() payload:Payload
  ) {
    return this.storeService.checkStoreValidation(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
