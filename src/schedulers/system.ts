import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { System } from "src/features/system/system.entity";
import { Repository } from "typeorm";

@Injectable()
export class SystemService{
    constructor(
        @InjectRepository(System)
        private systemRepository : Repository<System>
    ) {}
    @Cron('0 0 0 * * *')
    async updateCurrentDate(){
        await this.systemRepository.update(
            {id:1},
            {
                current_date: new Date().toISOString().split('T')[0]
            }
        )
    }
}