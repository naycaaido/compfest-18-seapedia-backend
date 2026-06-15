import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { ImageModule } from '../image/image.module';

@Module({
  controllers: [StoreController],
  imports:[
    TypeOrmModule.forFeature([Store]),
    ImageModule
  ],
  exports:[StoreService],
  providers: [StoreService],
})
export class StoreModule {}
