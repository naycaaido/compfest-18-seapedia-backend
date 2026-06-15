import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTypeItemDto } from './create-product-type-item.dto';

export class UpdateProductTypeItemDto extends PartialType(CreateProductTypeItemDto) {}
