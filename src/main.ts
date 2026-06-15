import { NestFactory, Reflector } from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module';
import { BadRequestException, ClassSerializerInterceptor, HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.register(fastifyMultipart,{
    limits:{
      fileSize: 5*1024*1024
    }
  })
  await app.register(fastifyStatic,{
    root:path.join(process.cwd(),'public'),
    prefix:'/public/'
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory:((errors) => {
      throw new BadRequestException(
        errors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints ?? "").join(', '),
        }))
      ) 
    })
    }),
  )

  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter()
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
