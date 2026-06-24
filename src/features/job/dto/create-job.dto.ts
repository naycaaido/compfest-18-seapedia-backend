import { IsNotEmpty, IsNumber } from "class-validator";

export class TakeJobDto {
    @IsNotEmpty()
    @IsNumber()
    job_id!:number
}
