import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Di chuyển đoạn code enableCors vào đây, sau khi 'app' đã được tạo
  app.enableCors({
    origin: 'http://localhost:3000', // FE port
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
