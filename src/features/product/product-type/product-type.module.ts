import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';

@Module({
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  imports:[TypeOrmModule.forFeature([ProductType])],
  exports:[ProductTypeService]
})
export class ProductTypeModule {}
