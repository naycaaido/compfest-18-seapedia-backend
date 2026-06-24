import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { FindWalletTransactionDto } from './dto/find-wallet-transactions.dto';

@UserRoleDecorator(UserRole.BUYER)  
@Controller('wallet-transactions')
export class WalletTransactionController {
  constructor(private readonly walletTransactionService: WalletTransactionService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,'Wallet Transaction'))
  @Post()
  create(
    @Body() createWalletTransactionDto: CreateWalletTransactionDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.walletTransactionService.create(createWalletTransactionDto,payload);
  }

  @Get()
  findAll(
    @Query() dto:FindWalletTransactionDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.walletTransactionService.findAll(dto,payload);
  }

  @UserRoleDecorator(UserRole.BUYER,UserRole.SELLER)
  @Get('revenue')
  findRevenue(
    @PayloadJWT() payload:Payload
  ) {
    return this.walletTransactionService.findRevenue(payload);
  }
}
