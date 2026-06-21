import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletTransactions } from './entities/wallet-transaction.entity';
import { DataSource, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { WalletTransactionType } from './entities/wallet-transaction-type.enum';
import { Wallet } from '../wallet/entities/wallet.entity';
import { NotFoundError } from 'rxjs';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { FindWalletTransactionDto } from './dto/find-wallet-transactions.dto';

@Injectable()
export class WalletTransactionService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(WalletTransactions)
    private walletTransactionsRepository:Repository<WalletTransactions>,
    @InjectRepository(Wallet)
    private walletRepository:Repository<Wallet>
  ) {}

  async create(createWalletTransactionDto: CreateWalletTransactionDto,payload:Payload) {
    return await this.dataSource.transaction(async manager => {
      const wallet = await manager.findOneBy(Wallet,{
        user:{
          id:payload.sub
        }
      })

      if(!wallet){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Wallet"))
      }
      const transaction = manager.create(
        WalletTransactions,{
          amount:createWalletTransactionDto.amount,
          description:"Top Up",
          type:WalletTransactionType.TOPUP,
          receiver:{
            id:payload.sub
          },
          sender:{
            id:payload.sub
          }
        }
      )
      await manager.increment(Wallet,
        {id:wallet.id},
        "balance",
        transaction.amount
      )
      return await manager.save(transaction)
    })
  }

  async findAll(findWalletTransactionDto:FindWalletTransactionDto,payload:Payload) {
    let where : FindOptionsWhere<WalletTransactions> = {}
    if(findWalletTransactionDto.wallet_transaction_type){
      where.type = findWalletTransactionDto.wallet_transaction_type
    }
    where.receiver = {
      id:payload.sub
    }
    where.sender = {
      id:payload.sub
    }
    return await this.walletTransactionsRepository.find({
      where:where,
      relations:{
        receiver:true,
        sender:true,
      }
    })
  }
}
