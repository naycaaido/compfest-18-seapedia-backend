import { Module } from '@nestjs/common';
import { ProductTypeItemService } from './product-type-item.service';
import { ProductTypeItemController } from './product-type-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeItem } from './entities/product-type-item.entity';
import { ProductTypeModule } from '../product-type/product-type.module';

@Module({
  controllers: [ProductTypeItemController],
  imports:[
    TypeOrmModule.forFeature([
      ProductTypeItem
    ]),
    ProductTypeModule
  ],
  exports:[
    ProductTypeItemService
  ],
  providers: [ProductTypeItemService],
})
export class ProductTypeItemModule {}
