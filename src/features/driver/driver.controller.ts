import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JobService } from '../job/job.service';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { Payload } from 'src/common/utils';
import { PayloadJWT } from 'src/decorators/payload.decorator';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { TakeJobDto } from '../job/dto/create-job.dto';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly jobService:JobService
  ) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,'Confirm Jobs'))
  @Post('job/:id')
  confirmJob(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.jobService.confirmJob(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Jobs History'))
  @Get('job/history')
  findAllJob(
    @PayloadJWT() payload:Payload
  ) {
    return this.jobService.findJob(payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Current Jobs'))
  @Get('job/current')
  findCurrentJob(
    @PayloadJWT() payload:Payload
  ) {
    return this.jobService.findJobActive(payload);
  }

  
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Available Jobs'))
  @Get('job/available')
  findAvailableJob(
  ) {
    return this.jobService.findAvailableJob();
  }
  

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Detail Job'))
  @Get('job/:id')
  findOne(
    @Param('id') id: string,
    @PayloadJWT() payload:Payload
  ) {
    return this.jobService.findOne(+id,payload);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.DEFAULT,'Take a Job'))
  @Post('job')
  takeJob(
    @Body() createJobDto: TakeJobDto,
    @PayloadJWT() payload:Payload
  ) {
    return this.jobService.takeJob(createJobDto,payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
