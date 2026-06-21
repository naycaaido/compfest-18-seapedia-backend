import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from 'src/decorators/public.decorator';
import { instanceToPlain } from 'class-transformer';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { AllQueryReviewDto } from './dto/all-query-review.dto';


@Public()
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @SuccessMessage(successMessageGlobal(SuccessMessageType.CREATE,"review"))
  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto) {
    return instanceToPlain(this.reviewService.create(createReviewDto));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,"reviews"))
  @Get()
  findAll(
      @Query() dto:AllQueryReviewDto
  ) {
    return instanceToPlain(this.reviewService.findAll(dto));
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,"review"))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @SuccessMessage(successMessageGlobal(SuccessMessageType.REMOVE,"review"))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
