import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from './system.entity';
import { SystemService } from './system.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
        System
    ]),
  ],
  exports:[SystemService],
  providers: [SystemService],
})
export class SystemModule {}
