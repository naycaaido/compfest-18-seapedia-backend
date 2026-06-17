import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTypeItemService } from './product-type-item.service';
import { CreateProductTypeItemDto } from './dto/create-product-type-item.dto';
import { UpdateProductTypeItemDto } from './dto/update-product-type-item.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';

@UserRoleDecorator(UserRole.SELLER)
@Controller('product-type-items')
export class ProductTypeItemController {
  constructor(private readonly productTypeItemService: ProductTypeItemService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Product type item'))
  @Post()
  create(
    @Body() createProductTypeItemDto: CreateProductTypeItemDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeItemService.create(createProductTypeItemDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Product type item'))
  @Get(':id')
  findAll(
    @Param('id') id:string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeItemService.findAll(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Product type item'))
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductTypeItemDto: UpdateProductTypeItemDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeItemService.update(+id, updateProductTypeItemDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Product type item'))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productTypeItemService.remove(+id,payload);
  }
}
