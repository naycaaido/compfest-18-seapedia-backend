import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { System } from "./system.entity";
import { exceptionMessage, ExceptionType } from "src/common/exception";


@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(System)
    private systemRepository: Repository<System>,
  ) {}

  async getBusinessDate(){
    const system =  await this.systemRepository.findOneBy({id:1})
    return new Date(system!.current_date)
  }

  async nextDay(){
    const system = await this.systemRepository.findOneBy({id:1})
    if(!system){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'System'))
    }

    const nextDate = new Date(system.current_date)
    nextDate.setDate(nextDate.getDate() + 1)
    await this.systemRepository.update(
      {id:1},
      {current_date: nextDate.toISOString().split('T')[0]}
    )
    return {
      current_date:nextDate
    }
  }
}