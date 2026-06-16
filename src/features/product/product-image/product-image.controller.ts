import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { Public } from 'src/decorators/public.decorator';
import { MultipartData } from 'src/decorators/multipart-data.decorator';
import { MultipartInterceptor } from 'src/interceptors/multipart.interceptor';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { RemoveProductImageDto } from './dto/create-product-image.dto';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';


@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @UserRoleDecorator(UserRole.SELLER)
  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'product image'))
  @UseInterceptors(new MultipartInterceptor('product_image'))
  @Post(':id')
  create(
    @Param('id') id:string,
    @MultipartData('product_image') {_,file},
    @PayloadJWT() payload : Payload
  ) {
    return this.productImageService.create(+id,file,payload);
  }

  @Public()
  @Get()
  findAll(
    @Query('product_id') product_id :string
  ) {
    return this.productImageService.findAll(+product_id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(+id);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'product image'))
  @UserRoleDecorator(UserRole.SELLER)
  @Delete()
  remove(
    @Body() dto : RemoveProductImageDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.productImageService.remove(dto,payload);
  }
}
