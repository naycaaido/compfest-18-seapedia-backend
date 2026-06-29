import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { System } from "src/features/system/system.entity";
import { Repository } from "typeorm";

@Injectable()
export class SystemService{
    constructor(
        @InjectRepository(System)
        private systemRepository : Repository<System>
    ) {
    }
    
    @Cron('0 0 0 * * *')
    async updateCurrentDate(){
        const jakartaDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Jakarta',
            }).format(new Date());

        await this.systemRepository.update(
        { id: 1 },
        {
            current_date: jakartaDate,
        });
    }
}