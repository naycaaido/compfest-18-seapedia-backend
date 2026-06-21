import { PartialType } from '@nestjs/mapped-types';
import { CreateCartProductTypeItemDto } from './create-cart-product-type-item.dto';

export class UpdateCartProductTypeItemDto extends PartialType(CreateCartProductTypeItemDto) {}
