import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entities/order-history.entity';
import { Order } from '../entities/order.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { UserRole } from '../../user/entities/role_user.enum';
import { exceptionMessage, ExceptionType } from 'src/common/exception';

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
