import { NestFactory, Reflector } from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module';
import { BadRequestException, ClassSerializerInterceptor, HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  

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
