import { PartialType } from '@nestjs/mapped-types';
import { TakeJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(TakeJobDto) {}
