import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderHistory } from "src/features/order/entities/order-history.entity";
import { OrderStatus } from "src/features/order/entities/order-status.enum";
import { Order } from "src/features/order/entities/order.entity";
import { ProductTypeItem } from "src/features/product/product-type-item/entities/product-type-item.entity";
import { ProductType } from "src/features/product/product-type/entities/product-type.entity";
import { Product } from "src/features/product/product/entities/product.entity";
import { System } from "src/features/system/system.entity";
import { SystemService } from "src/features/system/system.service";
import { WalletTransactionType } from "src/features/wallet/wallet-transaction/entities/wallet-transaction-type.enum";
import { WalletTransactions } from "src/features/wallet/wallet-transaction/entities/wallet-transaction.entity";
import { Wallet } from "src/features/wallet/wallet/entities/wallet.entity";
import { Brackets, DataSource, EntityManager, Repository } from "typeorm";


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
          orderItems:{
            product:{
              types:{
                items:true
              }
            },
            types:{
              orderProductTypeItems:{
                item:true
              }
            }
          }
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
      await this.restoreOrderStock(manager, order);
    });
  }

  private async restoreOrderStock(manager:EntityManager,order:Order){
    const productStockMap = new Map<number, number>();
    const typeItemStockMap = new Map<number, number>();

    for (const orderItem of order.orderItems) {
      productStockMap.set(
        orderItem.product.id,
        (productStockMap.get(orderItem.product.id) ?? 0) +
          orderItem.quantity,
      );
        for (const type of orderItem.types) {
        for (const typeItem of type.orderProductTypeItems) {
          typeItemStockMap.set(
            typeItem.item.id,
            (typeItemStockMap.get(typeItem.item.id) ?? 0) +
              orderItem.quantity,
          );
        }
      }
    }
    await Promise.all([
      ...Array.from(productStockMap.entries()).map(
        ([productId,quantity]) => 
          manager.increment(
            Product,
            {id:productId},
            'stock',
            quantity
          )
      ),
      ...Array.from(typeItemStockMap.entries()).map(
        ([itemId,quantity]) =>
          manager.increment(
            ProductTypeItem,
            {id:itemId},
            'stock',
            quantity
          )
      )
    ])
  }
  @Cron('* * * * *') 
  async handleCron(){
    await this.processOverdueOrders()
  }
}