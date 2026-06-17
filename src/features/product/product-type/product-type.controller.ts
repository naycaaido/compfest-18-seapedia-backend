import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { instanceToPlain } from 'class-transformer';

@UserRoleDecorator(UserRole.SELLER)
@Controller('product-types')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Product type'))
  @Post()
  create(
    @PayloadJWT() payload:Payload,
    @Body() createProductTypeDto: CreateProductTypeDto
  ) {
    return this.productTypeService.create(createProductTypeDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Product type'))
  @Get('product/:id')
  findAll(
    @Param('id') id:string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeService.findAll(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Product type'))
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeService.findOne(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Product type'))
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductTypeDto: UpdateProductTypeDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeService.update(+id, updateProductTypeDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Product type'))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeService.remove(+id,payload);
  }
}
