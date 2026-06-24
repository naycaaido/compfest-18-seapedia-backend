import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UserRoleDecorator } from "src/decorators/user-role.decorator";
import { UserRole } from "src/features/user/entities/role_user.enum";
import { VoucherService } from "./voucher.service";
import { FindVoucherDto } from "./dto/find-voucher.dto";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { successMessageGlobal, SuccessMessageType } from "src/common/success";
import { SuccessMessage } from "src/decorators/success-message.decorator";

@UserRoleDecorator(UserRole.ADMIN)
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Vouchers'))
  @Get()
  findAll(
    @Query() findVoucherDto:FindVoucherDto
  ) {
    return this.voucherService.findAll(findVoucherDto);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Voucher'))
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.voucherService.findOne(+id);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Voucher'))
  @Post()
  createVoucher(
    @Body() createVoucherDto:CreateVoucherDto
  ){
    return this.voucherService.createVoucher(createVoucherDto)
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.UPDATE,'Voucher'))
  @Patch(':id')
  updateVoucher(
    @Param('id') id:string,
    @Body() updateVoucherDto:UpdateVoucherDto
  ){
    return this.voucherService.updateVoucher(+id,updateVoucherDto)
  }
  
  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,'Voucher'))
  @Delete(':id')
  removeVoucher(
    @Param('id') id:string,
  ){
    return this.voucherService.removeVoucher(+id)
  }
}