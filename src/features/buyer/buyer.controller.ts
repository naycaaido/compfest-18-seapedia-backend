import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  create(@Body() createBuyerDto: CreateBuyerDto) {
    return this.buyerService.create(createBuyerDto);
  }

  @UserRoleDecorator(UserRole.BUYER)
  @Get('check')
  checkValid(
    @PayloadJWT() payload:Payload
  ){
    return this.buyerService.validBuyer(payload)
  }

  @Get()
  findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(+id);
  }

  @Patch()
  update(
    @PayloadJWT() payload:Payload, 
    @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyerService.update(payload, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerService.remove(+id);
  }
}
