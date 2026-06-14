import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { log } from 'console';
import { Payload } from 'src/common/utils';
import { exceptionMessage, ExceptionType } from 'src/common/exception';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(AppReview)
    private appReviewRepository: Repository<AppReview>
  ) {}

  async create(createReviewDto: CreateReviewDto,) {
    const review = this.appReviewRepository.create({
      ...createReviewDto,
      user:{
        id:createReviewDto.user_id
      }
    })
    return await this.appReviewRepository.save(review)
  }

  async findAll() {
    return await this.appReviewRepository.find();
  }

  async findOne(id: number) {
    const result =  await this.appReviewRepository.findOneBy({
      id
    });

    if(result == null){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Review"))
    }
    return result
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const result = await this.appReviewRepository.delete(id)

    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"delete the data"))
    }

    return true;
  }
}
