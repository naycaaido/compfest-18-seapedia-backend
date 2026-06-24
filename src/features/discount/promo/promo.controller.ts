import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UserRoleDecorator } from "src/decorators/user-role.decorator";
import { UserRole } from "src/features/user/entities/role_user.enum";
import { FindPromoDto } from "./dto/find-promo.dto";
import { PromoService } from "./promo.service";
import { CreatePromoDto } from "./dto/create-promo.dto";
import { SuccessMessage } from "src/decorators/success-message.decorator";
import { successMessageGlobal, SuccessMessageType } from "src/common/success";
import { UpdatePromoDto } from "./dto/update-promo.dto";

@UserRoleDecorator(UserRole.ADMIN)
@Controller('promos')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Promos'))
  @Get()
  findAll(
    @Query() findPromoDto:FindPromoDto
  ) {
    return this.promoService.findAll(findPromoDto);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Promo'))
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.promoService.findOne(+id);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Promo'))
  @Post()
  createPromo(
    @Body() createPromoDto:CreatePromoDto
  ){
    return this.promoService.createPromo(createPromoDto)
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Promo'))
  @Patch(':id')
  updatePromo(
    @Param('id') id:string,
    @Body() updatePromoDto:UpdatePromoDto
  ){
    return this.promoService.updatePromo(+id,updatePromoDto)
  }
  
  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Promo'))
  @Delete(':id')
  removePromo(
    @Param('id') id:string,
  ){
    return this.promoService.removePromo(+id)
  }
}