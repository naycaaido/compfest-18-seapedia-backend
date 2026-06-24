import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SellerModule } from 'src/features/seller/seller.module';
import { ImageModule } from 'src/features/image/image.module';
import { ProductTypeModule } from '../product-type/product-type.module';
import { StoreModule } from 'src/features/store/store.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { DiscountModule } from 'src/features/discount/discount/discount.module';

@Module({
  controllers: [ProductController],
  imports:[
    TypeOrmModule.forFeature([
      Product
    ]),
    forwardRef(() => ProductTypeModule),
    SellerModule,
    StoreModule,
    ImageModule,
    forwardRef(() => ProductCategoryModule),
    DiscountModule
    
  ],
  exports:[
    ProductService
  ],
  providers: [ProductService],
})
export class ProductModule {}
