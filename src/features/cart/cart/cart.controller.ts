import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { Public } from 'src/decorators/public.decorator';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { CreateCartItemDto } from '../cart-item/dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../cart-item/dto/update-cart-item.dto';

@UserRoleDecorator(UserRole.BUYER)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Cart'))
  @Post()
  create(
    @Body() createCartDto: CreateCartItemDto,
    @PayloadJWT() payload: Payload
  ) {
    return this.cartService.create(createCartDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Cart'))
  @Get()
  findCart(
    @PayloadJWT() payload:Payload
  ) {
    return this.cartService.findCart(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @PayloadJWT() payload:Payload
    ) {
    return this.cartService.update(+id, updateCartItemDto,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,"Cart item"))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.cartService.remove(+id,payload);
  }
}
