import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { MultipartInterceptor } from 'src/interceptors/multipart.interceptor';
import { MultipartData } from 'src/decorators/multipart-data.decorator';
import { Public } from 'src/decorators/public.decorator';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { FindProductDto } from './dto/find-product.dto';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,"Product"))
  @Post()
  @UserRoleDecorator(UserRole.SELLER)
  @UseInterceptors(new MultipartInterceptor('product_image',CreateProductDto))
  create(
    @MultipartData('product_image') {dto,file},
    @PayloadJWT() payload:Payload
  ) {
    return this.productService.create(dto,file,payload);
  }

  @Public()
  @Get()
  findAll(
    @Query() dto:FindProductDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productService.findAll(dto,payload);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productService.findOne(+id,true,{},undefined,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,"Product"))
  @Patch(':id')
  @UserRoleDecorator(UserRole.SELLER)
  update(
     @Body() dto: UpdateProductDto,
     @PayloadJWT() payload:Payload,
     @Param('id') id:string
  ) {
    return this.productService.update(+id,dto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,"Product"))
  @Delete(':id')
  @UserRoleDecorator(UserRole.SELLER)
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.productService.remove(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,'permanently remove the product'))
  @Delete('permanent/:id')
  @UserRoleDecorator(UserRole.ADMIN,UserRole.SELLER)
  removePermanent(
    @Param('id') id:string,
    @PayloadJWT() payload:Payload
  ){
    return this.productService.permanentDelete(+id,payload)
  }
}
