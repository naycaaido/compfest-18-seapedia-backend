import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { isArray, ValidationError } from 'class-validator';
import { log } from 'console';
import {FastifyRequest, FastifyReply} from 'fastify'
import { QueryFailedError, TypeORMError } from 'typeorm';
import { isMap } from 'util/types';
@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message:any = 'Internal server error';
    

    if (exception instanceof HttpException){
      status = exception.getStatus();
      const response = exception.getResponse()
      if(typeof response === 'object' && response != null && "message" in response){
        message = response['message'] as string
      } else {
        message = exception.message;
      }
    }

    if (exception instanceof ValidationError){
      status = HttpStatus.BAD_REQUEST;
      log("do exception")
      message = exception.children?.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints ?? "").join(', '),
        }))
    }

    if(exception instanceof QueryFailedError){
      if(exception.driverError.code == '23503'){
        message = 'Data is not found'
        status = HttpStatus.NOT_FOUND
      }
    }

    if (Array.isArray(exception) && exception.every((e) => e instanceof ValidationError)) {
      status = HttpStatus.BAD_REQUEST;
      const validationErrors = exception;
      message = validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints ?? "").join(', '),
        }))
      }
   

  
    if (exception instanceof TypeORMError){
      if(exception instanceof QueryFailedError){
        const code = exception.driverError['code']
        if(code == 23505){
          status = HttpStatus.BAD_REQUEST
          message = 'Data already exists'
        }
        log('code custom',exception.driverError['detail'])
      }
    }

    log('common',exception)
    response.status(status).send({
      status_code: status,
      message : message,
    });
  }
}

