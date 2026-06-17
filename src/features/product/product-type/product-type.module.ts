import { forwardRef, Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  imports:[
    TypeOrmModule.forFeature([ProductType]),
    forwardRef(() => ProductModule),
  ],
  exports:[ProductTypeService]
})
export class ProductTypeModule {}
