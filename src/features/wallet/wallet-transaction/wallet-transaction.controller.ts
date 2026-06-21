import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { PublicUserRoles } from 'src/common/utils';

@UserRoleDecorator(...PublicUserRoles)  
@Controller('wallet-transaction')
export class WalletTransactionController {
  constructor(private readonly walletTransactionService: WalletTransactionService) {}

  @Post()
  create(@Body() createWalletTransactionDto: CreateWalletTransactionDto) {
    return this.walletTransactionService.create(createWalletTransactionDto);
  }

  @Get()
  findAll() {
    return this.walletTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletTransactionDto: UpdateWalletTransactionDto) {
    return this.walletTransactionService.update(+id, updateWalletTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletTransactionService.remove(+id);
  }
}
