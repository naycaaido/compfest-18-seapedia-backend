import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { ImageModule } from '../image/image.module';
import { GeocodingService } from './geocode.service';
import { City, District, Province, Village } from './entities/region.entity';

@Module({
  controllers: [StoreController],
  imports:[
    TypeOrmModule.forFeature([
      Store,
      Province,
      City,
      District,
      Village
    ]),
    ImageModule,
  ],
  exports:[StoreService],
  providers: [StoreService,GeocodingService],
})
export class StoreModule {}
