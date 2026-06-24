import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { JobModule } from '../job/job.module';

@Module({
  controllers: [DriverController],
  imports:[
    TypeOrmModule.forFeature([
      Driver
    ]),
    JobModule
  ],
  providers: [DriverService],
  exports:[DriverService]
})
export class DriverModule {}
