import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [ProductCategoryController],
  imports:[
    TypeOrmModule.forFeature([
      ProductCategory
    ]),
    forwardRef(() => ProductModule)
  ],
  exports:[
    ProductCategoryService
  ],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
