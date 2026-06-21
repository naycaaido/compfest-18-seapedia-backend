import { PartialType } from '@nestjs/mapped-types';
import { CreateCartProductTypeDto } from './create-cart-product-type.dto';

export class UpdateCartProductTypeDto extends PartialType(CreateCartProductTypeDto) {}
