import { Injectable } from '@nestjs/common';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { EntityManager, FindOptionsRelations, FindOptionsWhere, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { DiscountUsage } from './entities/discount-usage.entity';
import { Promo } from '../promo/entities/promo.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { FindDiscountDto } from './dto/find-discount.dto';
import { SystemService } from '../../system/system.service';
import { DiscountType } from './entities/discount-type.enum';
import { log } from 'console';


@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository : Repository<Discount>,
    @InjectRepository(DiscountUsage)
    private discountUsageRepository : Repository<DiscountUsage>,
    @InjectRepository(Promo)
    private promoRepository : Repository<Promo>,
    @InjectRepository(Voucher)
    private voucherRepository : Repository<Voucher>,
    private readonly systemService :SystemService,
  ) {}



  async findAll(
    dto:FindDiscountDto
  ) {
    const businessDate = await this.systemService.getBusinessDate()
    let where : FindOptionsWhere<Discount> = {
      expired_date:MoreThanOrEqual(businessDate)
    }
    if(dto.discount_type){
      where.type = dto.discount_type
    }
    if(dto.showing_expired){
      where.expired_date = undefined
    }
    return await this.discountRepository.find({
      where
    })
  }

  async findOne(
    id: number,
    dto:FindDiscountDto
  ) {
    const businessDate = await this.systemService.getBusinessDate()
    let where : FindOptionsWhere<Discount> = {
      id,
      expired_date:MoreThanOrEqual(businessDate)
    }
    let relations : FindOptionsRelations<Discount> = {}
    if(dto.discount_type){
      where.type = dto.discount_type
      switch (dto.discount_type) {
        case DiscountType.PROMO:
          relations.promo = true
          break;

        case DiscountType.VOUCHER:
          relations.voucher = true
          break;          
      }
    }
    if(dto.showing_expired){
      where.expired_date = undefined
    }

    return await this.discountRepository.findOne({
      where,
      relations
    })
  }


  async validatePromoUsage(buyerId:number | undefined, discountId:number, discountNew?:Discount | undefined){
    const businessDate = await this.systemService.getBusinessDate()

    const validDiscount  = await this.validatePromoDiscountExpired(discountId,discountNew,businessDate)

    if (!validDiscount) {
      return false
    }

    const usage = await this.discountUsageRepository.findOne({
      where:{
        buyer:{
          id:buyerId
        },
        discount:{
          id:discountId
        }
      },
      relations:{
        discount:true
      }
    })
    if (!usage) {
      return true;
    }

    return usage.usage_count < usage.discount.max_usage_per_user
  }

  async validatePromoDiscountExpired(
    discountId:number,
    discount:Discount | undefined,
    businessDate:Date
  ){
    const targetDiscount =
    discount ??
    await this.discountRepository.findOneBy({
      id: discountId,
    })

    if (!targetDiscount) {
      return false
    }

    return targetDiscount.expired_date >= businessDate
  }

  async addDiscountUsage(
    manager:EntityManager,
    buyerId: number,
    discountId: number,
  ) {
    let usage = await manager
      .getRepository(DiscountUsage)
      .createQueryBuilder("usage")
      .setLock("pessimistic_write")
      .where("usage.buyer_id = :buyerId", { buyerId })
      .andWhere("usage.discount_id = :discountId", { discountId })
      .getOne()

    if (!usage) {
      usage = manager.create(DiscountUsage, {
        buyer: { id: buyerId },
        discount: { id: discountId },
        usage_count: 1,
      })
    }else{
      usage.usage_count ++
    }
    await manager.save(usage)
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
  }
}
