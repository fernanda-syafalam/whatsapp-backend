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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common'; // <-- Import Logger

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = new Logger('NestApplication'); 
  const port = process.env.PORT ?? 3000;
  const globalPrefix = 'api/v1';

  await app.register(fastifyCors, {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('WhatsApp System API')
    .setDescription('API documentation for the WhatsApp System')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/${globalPrefix}`, 'Local Development Server')
    .addServer('https://whatsapp-api.astaweda.com/api/v1', 'Production Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  // --- Global Middleware & Interceptors ---
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.setGlobalPrefix(globalPrefix);

  // --- Application Startup ---
  await app.listen(port, '0.0.0.0');
  logger.log(`Server is running on port: ${port}`);
  logger.log(`Application started successfully.`);
  logger.verbose(`Access your API at: http://localhost:${port}/${globalPrefix}`);
  logger.verbose(`Access Swagger UI at: http://localhost:${port}/api/v1`);
}

bootstrap();