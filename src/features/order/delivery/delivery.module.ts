import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  providers: [DeliveryService],
  exports:[DeliveryService]
})
export class DeliveryModule {}
