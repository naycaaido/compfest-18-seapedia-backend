import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from './system.entity';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { OrderModule } from '../order/order.module';
import { SchedulerModule } from 'src/schedulers/scheduler.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
        System
    ]),
    SchedulerModule
  ],
  controllers:[SystemController],
  exports:[SystemService],
  providers: [SystemService],
})
export class SystemModule {}
