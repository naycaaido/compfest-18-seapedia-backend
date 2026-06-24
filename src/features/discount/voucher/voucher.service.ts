import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Voucher } from "./entities/voucher.entity";
import { FindOptionsWhere, MoreThanOrEqual, Repository } from "typeorm";
import { FindVoucherDto } from "./dto/find-voucher.dto";
import { SystemService } from "src/features/system/system.service";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { exceptionMessage, ExceptionType } from "src/common/exception";
import { addTimeToDate } from "src/common/utils";
import { DiscountType } from "../discount/entities/discount-type.enum";


@Injectable()
export class VoucherService{
    constructor(
        @InjectRepository(Voucher)
        private voucherRepository : Repository<Voucher>,
        private readonly systemService:SystemService,
    ) {}

    async findAll(findVoucherDto:FindVoucherDto){
        const businessDate = await this.systemService.getBusinessDate()
        let where : FindOptionsWhere<Voucher> = {
          discount:{
            expired_date:MoreThanOrEqual(businessDate)
          }
        }
        if(findVoucherDto.showing_expired){
          where.discount = {
            expired_date: undefined
          }
        }
        return await this.voucherRepository.find({
            where,
            relations:{
                discount:true
            }
        })
    }

    async findOne(id:number){
      return await this.voucherRepository.findOne({
        where:{
          id,
        },
        relations:{
          discount:true
        }
      })
    }

    async createVoucher(createVoucheroDto: CreateVoucherDto) {
      const voucherCreated = this.voucherRepository.create({
        code:createVoucheroDto.code,
        discount:{
          ...createVoucheroDto,
          expired_date:addTimeToDate(createVoucheroDto.expired_date),
          type:DiscountType.PROMO
        },
      })
      
      return await this.voucherRepository.save(voucherCreated);
    }

    async updateVoucher(id:number,updateVoucherDto: UpdateVoucherDto) {
      const voucher = await this.voucherRepository.findOne({
        where:{
          id,
        },
        relations:{
          discount:true
        }
      })
      if(!voucher){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Promo'))
      }
      const voucherCreated = this.voucherRepository.create({
        code:updateVoucherDto.code,
        discount:{
          ...updateVoucherDto,
          expired_date:updateVoucherDto.expired_date != null ? addTimeToDate(updateVoucherDto.expired_date) : undefined,
        },
      })
      const voucherUpdated = this.voucherRepository.merge(voucher,voucherCreated)
      return await this.voucherRepository.save(voucherUpdated);
    }

    async removeVoucher(id:number) {
      await this.voucherRepository.softDelete({id});
      return true
    }    
}