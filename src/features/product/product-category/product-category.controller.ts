import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { UpdateProductCategoriesDto } from './dto/update-product-categories.dto';

@UserRoleDecorator(UserRole.SELLER)
@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Product Category'))
  @Post()
  create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productCategoryService.create(createProductCategoryDto,payload);
  }

  @UserRoleDecorator(UserRole.SELLER)
  @Get()
  findAll(
    @PayloadJWT() payload:Payload
  ) {
    return this.productCategoryService.findAll(payload);
  }

  @UserRoleDecorator(UserRole.SELLER)  
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productCategoryService.findOne(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Product Category'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload,
    @Body() updateProductCategoryDto: UpdateProductCategoriesDto) {
    return this.productCategoryService.update(+id, updateProductCategoryDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Product Category'))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productCategoryService.remove(+id,payload);
  }
}
