import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ImageModule } from 'src/features/image/image.module';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
  imports:[TypeOrmModule.forFeature([
    ProductImage
  ]),
  ImageModule
  ]
})
export class ProductImageModule {}
