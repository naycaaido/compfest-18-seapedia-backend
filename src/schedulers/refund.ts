import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderHistory } from "src/features/order/entities/order-history.entity";
import { OrderStatus } from "src/features/order/entities/order-status.enum";
import { Order } from "src/features/order/entities/order.entity";
import { System } from "src/features/system/system.entity";
import { SystemService } from "src/features/system/system.service";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { Wallet } from "src/features/wallet/wallet/entities/wallet.entity";
import { Brackets, DataSource, Repository } from "typeorm";


@Injectable()
export class OrderSchedulerService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(System)
    private systemRepository: Repository<System>,
  ) {}

  async processOverdueOrders() {

    const system = await this.systemRepository.findOneBy({id:1})
    const businessDate = new Date(system!.current_date)

    const overdueOrders = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.id', 'id')
      .where('order.status IN (:...statuses)', {
        statuses: [
            OrderStatus.WAITING_DRIVER,
            OrderStatus.ON_WAY,
            OrderStatus.PROCCESS
        ],
        })
      .andWhere('order.overdue <= :businessDate', {
        businessDate,
      })
      .getRawMany();

    for (const overdueOrder of overdueOrders) {
      await this.refundOverdueOrder(overdueOrder.id);
    }
  }

  private async refundOverdueOrder(orderId: number) {
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: {
          id: orderId,
        },
        relations: {
          buyer: true,
        },
      });

      if (!order) {
        return;
      }

      if (order.status === OrderStatus.RETURN) {
        return;
      }

      const buyerWallet = await manager.findOne(Wallet, {
        where: {
          user: {
            id:order.buyer.id
          },
        },
      });

      if (!buyerWallet) {
        throw new NotFoundException('Buyer wallet not found');
      }

      await manager.increment(
        Wallet,
        {
          id: buyerWallet.id,
        },
        'balance',
        order.total_fee,
      );

      await manager.save(
        WalletTransactions,
        {
          type: WalletTransactionType.REFUND,
          amount: order.total_fee,
          description: `Auto refund overdue order #${order.id}`,
          order:{
            id:order.id
          },
          receiver: {
            id: order.buyer.id,
          },
        },
      );

      await manager.update(
        Order,
        order.id,
        {
          status: OrderStatus.RETURN,
        },
      );

      await manager.save(
        OrderHistory,
        {
          order: {
            id: order.id,
          },
          status_order: OrderStatus.RETURN,
        },
      );
    });
  }
  @Cron('* * * * *') 
  async handleCron(){
    await this.processOverdueOrders()
  }
}