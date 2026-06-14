import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppReview } from './entities/review.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([AppReview])
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
