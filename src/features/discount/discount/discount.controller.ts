import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../../user/entities/role_user.enum';
import { FindDiscountDto } from './dto/find-discount.dto';

@UserRoleDecorator(UserRole.ADMIN)
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // @Post('promo')
  // createPromo(@Body() createDiscountDto: CreateDiscountDto) {
  //   return this.discountService.createPromo(createDiscountDto);
  // }

  @Get()
  findAll(
    @Query() findDiscountDto:FindDiscountDto
  ) {
    return this.discountService.findAll(findDiscountDto);
  }

  // @Get(':id')
  // findOne(
  //   @Param('id') id: string,
  //   @Query() findDiscountDto:FindDiscountDto
  // ) {
  //   return this.discountService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
  //   return this.discountService.update(+id, updateDiscountDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.discountService.remove(+id);
  // }
}
