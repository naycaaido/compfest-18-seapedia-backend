import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, FindOptionsWhere, MoreThanOrEqual } from "typeorm"
import { FindPromoDto } from "./dto/find-promo.dto"
import { Promo } from "./entities/promo.entity"
import { SystemService } from "src/features/system/system.service"
import { CreateDiscountDto } from "../discount/dto/create-discount.dto"
import { log } from "console"
import { DiscountType } from "../discount/entities/discount-type.enum"
import { CreatePromoDto } from "./dto/create-promo.dto"
import { addTimeToDate } from "src/common/utils"
import { UpdatePromoDto } from "./dto/update-promo.dto"
import { exceptionMessage, ExceptionType } from "src/common/exception"

@Injectable()
export class PromoService{
    constructor(
        @InjectRepository(Promo)
        private promoRepository : Repository<Promo>,
        private readonly systemService:SystemService,
    ) {}

    async findAll(findPromoDto:FindPromoDto){
        const businessDate = await this.systemService.getBusinessDate()
        let where : FindOptionsWhere<Promo> = {
          discount:{
            expired_date:MoreThanOrEqual(businessDate)
          }
        }
        if(findPromoDto.showing_expired){
          where.discount = {
            expired_date: undefined
          }
        }
        return await this.promoRepository.find({
            where,
            relations:{
              products:true,
              discount:true
            }
        })
    }

    async findOne(id:number){
      return await this.promoRepository.findOne({
        where:{
          id,
        },
        relations:{
          discount:true
        }
      })
    }

    async createPromo(createPromoDto: CreatePromoDto) {
      const promoCreated = this.promoRepository.create({
        discount:{
          ...createPromoDto,
          remaining_usage:1,
          expired_date:addTimeToDate(createPromoDto.expired_date),
          type:DiscountType.PROMO
        },
        products:createPromoDto.product_ids.map((productId) => ({
          id:productId
        }))
      })
      
      return await this.promoRepository.save(promoCreated);
    }

    async updatePromo(id:number,updatePromoDto: UpdatePromoDto) {
      const promo = await this.promoRepository.findOne({
        where:{
          id,
        },
        relations:{
          discount:true
        }
      })
      if(!promo){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Promo'))
      }
      const promoCreated = this.promoRepository.create({
        products:updatePromoDto.product_ids != null ? updatePromoDto.product_ids.map((productId) =>({
          id:productId
        })) : undefined,
        discount:{
          ...updatePromoDto,
          expired_date:updatePromoDto.expired_date != null ? addTimeToDate(updatePromoDto.expired_date) : undefined,
        },
      })
      const promoUpdated = this.promoRepository.merge(promo,promoCreated)
      log(promoUpdated.id)
      return await this.promoRepository.save(promoUpdated);
    }

    async removePromo(id:number) {
      const promo = await this.promoRepository.findOne({
        where: { id },
        relations: {
          products: true
        }
      })
      if(!promo){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Promo'))
      }
      await this.promoRepository.softRemove(promo);
      return true
    }
}