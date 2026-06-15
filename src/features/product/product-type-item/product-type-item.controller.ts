import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTypeItemService } from './product-type-item.service';
import { CreateProductTypeItemDto } from './dto/create-product-type-item.dto';
import { UpdateProductTypeItemDto } from './dto/update-product-type-item.dto';

@Controller('product-type-item')
export class ProductTypeItemController {
  constructor(private readonly productTypeItemService: ProductTypeItemService) {}

  @Post()
  create(@Body() createProductTypeItemDto: CreateProductTypeItemDto) {
    return this.productTypeItemService.create(createProductTypeItemDto);
  }

  @Get()
  findAll() {
    return this.productTypeItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTypeItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductTypeItemDto: UpdateProductTypeItemDto) {
    return this.productTypeItemService.update(+id, updateProductTypeItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypeItemService.remove(+id);
  }
}
