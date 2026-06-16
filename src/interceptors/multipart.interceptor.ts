import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { log } from 'console';
import { FastifyRequest } from 'fastify';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { File } from 'src/features/image/constant';

@Injectable()
export class MultipartInterceptor implements NestInterceptor {

  dto?:ClassConstructor<any>
  fileFieldName!:string

  constructor(fileFieldName:string,dto?:ClassConstructor<any>){
    this.dto = dto
    this.fileFieldName = fileFieldName
  }
  async intercept(context: ExecutionContext, next: CallHandler){
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()

    const files:[] = []
    const data:any = {};
    
    try {
      for await (const part of request.parts()){
        if (part.type === 'field'){
          let value: any = part.value;

          if (typeof value === 'string' &&
            (value.startsWith('{') || value.startsWith('['))) {
              try {
                value = JSON.parse(value);
              } catch {
                // Not valid JSON, keep original string
              }
            }
          data[part.fieldname] = value
        } else if(part.type === 'file' && part.fieldname == this.fileFieldName){
          const chunks: any[] = []
          for await (const chunk of part.file){
            chunks.push(chunk)
          }
          const buffer = Buffer.concat(chunks)
          const file = new File(part.fieldname,part.filename,part.mimetype,buffer)
          if (!files[part.fieldname]) {
            files[part.fieldname] = [];
          }
          files[part.fieldname].push(file);
        } else {
          part.file.resume()
        }
      }
      if (this.dto){
        const model:object = plainToInstance(this.dto,data)
        await validateOrReject(model);
        (request as any).dto = model;
      }
      (request as any).files = files;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,error.message))
      }
      throw error
    }
    return next.handle();
  }
}
