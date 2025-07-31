import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCors from '@fastify/cors';
import { ValidationPipe } from 'common/pipes/validation.pipe';
import { HttpExceptionFilter } from 'common/filter/http-exception-filter.filter';
import { ApiResponseInterceptor } from 'common/interceptors/api-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCors, {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  console.log('Server is running on port:', process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
