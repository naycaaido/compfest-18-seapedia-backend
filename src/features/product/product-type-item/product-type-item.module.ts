import { Module } from '@nestjs/common';
import { ProductTypeItemService } from './product-type-item.service';
import { ProductTypeItemController } from './product-type-item.controller';

@Module({
  controllers: [ProductTypeItemController],
  providers: [ProductTypeItemService],
})
export class ProductTypeItemModule {}
