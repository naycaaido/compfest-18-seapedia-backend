import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entities/order-history.entity';
import { Order } from '../entities/order.entity';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { UserRole } from '../../user/entities/role_user.enum';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Cart } from '../../cart/cart/entities/cart.entity';
import { log } from 'console';
import { DeliveryService } from '../delivery/delivery.service';
import { Address } from '../../address/entities/address.entity';
import { PreviewOrderDto } from '../dto/preview-order.dto';
import { Store } from '../../store/entities/store.entity';
import { deliveryFee, DeliveryMethod } from '../entities/delivery-method.enum';
import { Buyer } from '../../buyer/entities/buyer.entity';
import { SystemService } from '../../system/system.service';
import { mapToOrder } from '../mapper/order.mapper';
import { Product } from '../../product/product/entities/product.entity';
import { ProductTypeItem } from '../../product/product-type-item/entities/product-type-item.entity';
import { CartItem } from '../../cart/cart-item/entities/cart-item.entity';
import { Wallet } from '../../wallet/wallet/entities/wallet.entity';
import { WalletTransactions } from '../../wallet/wallet-transaction/entities/wallet-transaction.entity';
import { WalletTransactionType } from '../../wallet/wallet-transaction/entities/wallet-transaction-type.enum';
import { OrderStatus } from '../entities/order-status.enum';
import { FindOrderDto } from '../dto/find-order.dto';
import { DiscountService } from '../../discount/discount/discount.service';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    
  }
  async findAllHistory(id:number,payload:Payload){
    let where: FindOptionsWhere<Order> = {}
    this.addRole(where,payload.role,payload.userRoleId)
    where.id = id
    const order = await this.orderRepository.findOneBy(where)
    if (!order){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Order"))
    }
    return await this.orderHistoryRepository.find({
      where: {
        order: {
          id
        }
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }

  private addRole(where:FindOptionsWhere<Order>, userRole:UserRole, id:number){
    if(userRole == UserRole.BUYER){
      where.buyer = {
        id
      }
    }else{
      where.store = {
        seller:{
          id
        }
      }
    }
  }
}
