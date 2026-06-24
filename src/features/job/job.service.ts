import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TakeJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Payload } from 'src/common/utils';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Driver } from 'typeorm/browser';
import { OrderStatus } from '../order/entities/order-status.enum';
import { OrderHistory } from '../order/entities/order-history.entity';
import { WalletTransactionService } from '../wallet/wallet-transaction/wallet-transaction.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository:Repository<Job>,
    private walletTransactionService:WalletTransactionService
  ) {
    
  }
  async create(order: Order,manager:EntityManager) {
    const job =  this.jobRepository.create({
      earning:order.delivery_fee,
      expired_date:order.overdue,
      order:{
        id:order.id
      }
    })
    await manager.save(Job,job)
  }

  async takeJob(dto: TakeJobDto, payload: Payload) {
    return await this.jobRepository.manager.transaction(async (manager) => {
    
      const job = await manager
      .getRepository(Job)
      .createQueryBuilder("job")
      .setLock("pessimistic_write")
      .innerJoinAndSelect("job.order", "order")
      .where("job.id = :id",{
        id:dto.job_id
      })
      .getOne()


      if (!job) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Job'));
      }

      if (job.driver_id !== null && job.driver_id !== undefined) {
        throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Job Already Taken'));
      }

      job.driver_id = payload.userRoleId;
      await manager.save(Job, job);
      await this.changeOrderStatus(manager,job.order,OrderStatus.ON_WAY)
      return job
    }); 
  }

  async confirmJob(id:number,payload:Payload){
    return await this.jobRepository.manager.transaction(async (manager) => {
    
      const job = await manager.findOne(Job, {
        where: {
          id,
          driver:{
            id:payload.userRoleId
          }
        },
        relations:{
          order:{
            store:{
              seller:{
                user:true
              }
            }
          }
        }
      });

      if (!job) {
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Job'));
      }
      await manager.update(
        Job,
        job.id,
        {is_done:true}
      );
      const sellerId = job.order.store.seller.user.id
      const driverId = payload.sub
      await this.changeOrderStatus(manager,job.order,OrderStatus.DONE)
      await this.walletTransactionService.settleOrderPayment(manager,job.order,sellerId,driverId)
      return job
    }); 
  }

  async findAvailableJob(){
    return await this.jobRepository.find({
      where:{
        driver_id: IsNull()
      },
      relations:{
        order:{
          orderAddress:true,
          orderItems:{
            types:{
              type:true,
              orderProductTypeItems:{
                item:true
              }
            }
          },
          store:true
        }
      }
    })
  }
  
  async findJob(payload:Payload){
    const [activeJob,historyJob] = await Promise.all([
      this.jobRepository.find({
        where:{
          driver:{
            id:payload.userRoleId
          },
          is_done:false
        },
        relations:{
        order:{
          orderAddress:true,
          orderItems:{
            types:{
              type:true,
              orderProductTypeItems:{
                item:true
              }
            }
          },
          store:true
        }
        },
        order:{
          id:'DESC'
        }
      }),

      this.jobRepository.find({
        where:{
          driver:{
            id:payload.userRoleId
          },
          is_done:true
        },
        relations:{
          order:{
            orderAddress:true,
            orderItems:true
          }
        },
        order:{
          id:'DESC'
        }
      })
    ])

    return {
      active_job:activeJob,
      history_job:historyJob
    }
  }

  async changeOrderStatus(
    manager: EntityManager,
    order: Order,
    status: OrderStatus,
  ) {
    await manager.update(
      Order,
      order.id,
      {status}
    );

    await manager.save(
      OrderHistory,
      manager.create(OrderHistory, {
        order,
        status_order: status,
      }),
    );
  }

  async findOne(id: number,payload:Payload) {
    const job = await this.jobRepository.findOne({
      where:{
        id,
        driver:{
          id:payload.userRoleId
        }
      },
      relations:{
        order:{
          orderAddress:true,
          orderItems:true
        }
      },
    })
    if(!job){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Job Not Found'))
    }
    return job
  }
}
