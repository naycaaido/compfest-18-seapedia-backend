import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { System } from "./system.entity";

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
}