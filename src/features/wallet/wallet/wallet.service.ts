import { Inject, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { Payload } from 'src/common/utils';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository : Repository<Wallet>
  ) {}
  async findOne(payload:Payload) {
    return await this.walletRepository.findOneBy({
      user:{
        id:payload.sub
      }
    })
  }
}
