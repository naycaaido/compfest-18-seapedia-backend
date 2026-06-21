import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { Payload } from 'src/common/utils';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get()
  findWallet(
    @PayloadJWT() payload:Payload
  ) {
    return this.walletService.findOne(payload);
  }
}
