import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { FindOrderDto } from './dto/find-order.dto';
import { OrderHistoryService } from './services/order-history.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderHistoryService:OrderHistoryService) {}

  @UserRoleDecorator(UserRole.BUYER,UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Orders'))
  @Get()
  findAll(
    @Query() findOrderDto:FindOrderDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.orderService.findAll(payload,findOrderDto);
  }

  @UserRoleDecorator(UserRole.BUYER,UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Order Detail'))
  @Get(':id')
  findOne(
    @PayloadJWT() payload:Payload,
    @Param('id') id:string
  ) {
    return this.orderService.findOne(+id,payload);
  }

  @UserRoleDecorator(UserRole.BUYER,UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Order History Status'))
  @Get('history/:id')
  findAllHistory(
    @PayloadJWT() payload:Payload,
    @Param('id') id:string
  ) {
    return this.orderHistoryService.findAllHistory(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Preview'))
  @UserRoleDecorator(UserRole.BUYER)
  @Post('preview')
  preview(
    @Body() previewOrderDto : PreviewOrderDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.orderService.preview(payload,previewOrderDto);
  }

  @UserRoleDecorator(UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Order Detail'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @PayloadJWT() payload: Payload
  ) {
    return this.orderService.update(+id, payload, updateOrderDto);
  }

  // Create
  @UserRoleDecorator(UserRole.BUYER,UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Order'))
  @Post()
  create(
    @PayloadJWT() payload:Payload,
    @Body() previewOrderDto : PreviewOrderDto,
    ) {
    return this.orderService.create(payload,previewOrderDto);
  }
}
