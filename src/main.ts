import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Lấy ConfigService từ NestJS app instance
 const configService = app.get(ConfigService);
  // Di chuyển đoạn code enableCors vào đây, sau khi 'app' đã được tạo
   app.enableCors({
    // Lấy URL frontend từ biến môi trường FRONTEND_URL
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
