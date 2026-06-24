import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletTransactions } from './entities/wallet-transaction.entity';
import { DataSource, EntityManager, FindManyOptions, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { WalletTransactionType } from './entities/wallet-transaction-type.enum';
import { Wallet } from '../wallet/entities/wallet.entity';
import { NotFoundError } from 'rxjs';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { FindWalletTransactionDto } from './dto/find-wallet-transactions.dto';
import { log } from 'console';
import { Revenue } from './entities/revenue';
import { UserRole } from 'src/features/user/entities/role_user.enum';
import { Order } from 'src/features/order/entities/order.entity';
import { Job } from 'src/features/job/entities/job.entity';
import { OrderStatus } from 'src/features/order/entities/order-status.enum';

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

  async findAll(
    findWalletTransactionDto: FindWalletTransactionDto,
    payload: Payload,
  ) {
    const type = findWalletTransactionDto.wallet_transaction_type;

    const where =
      payload.role === UserRole.BUYER
        ? [
            {
              sender: {
                id: payload.sub,
              },
              ...(type && { type }),
            },
            {
              receiver: {
                id: payload.sub,
              },
              ...(type && { type }),
            },
          ]
        : {
            receiver: {
              id: payload.sub,
            },
            sender:IsNull(),
            order: {
              status: OrderStatus.DONE,
            },
            ...(type && { type }),
          };

    return await this.walletTransactionsRepository.find({
      where,
      order: {
        id: "DESC",
      },
      loadRelationIds: true,
    });
  }

  async findRevenue(payload: Payload) {
    const query = this.walletTransactionsRepository
      .createQueryBuilder("tx")
      .select("COALESCE(SUM(tx.amount), 0)", "total")
      .where("tx.type = :type", {
        type: WalletTransactionType.PAYMENT,
      });

    if (payload.role === UserRole.BUYER) {
      query.andWhere("tx.sender_id = :userId", {
        userId: payload.sub,
      });
    } else {
      query
        .innerJoin("tx.order", "order")
        .andWhere("tx.receiver_id = :userId", {
          userId: payload.sub,
        })
        .andWhere("order.status = :status", {
          status: OrderStatus.DONE,
        })
        .andWhere("tx.sender_id IS NUll");
    }

    const result = await query.getRawOne();

    return Number(result.total);
  }

  async processPaymentOrder(
      manager:EntityManager,
      wallet:Wallet,
      type:WalletTransactionType,
      description:string,
      amount: number,
      senderId:number,
      receiverId:number,
      orderId?:number
    ){
      if(wallet.balance < amount){
        throw new BadRequestException(
          exceptionMessage(ExceptionType.BAD_REQUEST,"Insufficient Balance")
        )
      }
  
      await manager.decrement(
        Wallet,
        {
          id:wallet.id
        },
        "balance",
        amount
      )
      await manager.save(
        WalletTransactions,{
          type:type,
          amount:amount,
          description:description,
          order:{
            id:orderId
          },
          receiver:{
            id:receiverId
          },
          sender:{
            id:senderId
          }
        }
      )
  }

  async settleOrderPayment(
    manager: EntityManager,
    order: Order,
    userSellerId:number,
    userDriverId:number
  ) {
    const driverAmount = order.delivery_fee;
    const sellerAmount = order.total_fee - order.delivery_fee;

    await manager.increment(
      Wallet,
      {
        user: {
          id: userDriverId,
        },
      },
      'balance',
      driverAmount,
    );

    await manager.increment(
      Wallet,
      {
        user: {
          id: userSellerId,
        },
      },
      'balance',
      sellerAmount,
    );
    await manager.save(
      WalletTransactions,
      [
        {
          type: WalletTransactionType.PAYMENT,
          amount: driverAmount,
          description: `Delivery income for order #${order.id}`,
          order:{
            id:order.id
          },
          receiver: { id: userDriverId },
        },
        {
          type: WalletTransactionType.PAYMENT,
          amount: sellerAmount,
          order:{
            id:order.id
          },
          description: `Sales income for order #${order.id}`,
          receiver: { id: userSellerId },
        },
      ]
    );
  }
}
