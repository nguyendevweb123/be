// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // THÊM DÒNG NÀY

@Module({
  imports: [
    // 1. THÊM ConfigModule.forRoot() vào đây
    // isGlobal: true làm cho ConfigService có sẵn ở mọi nơi trong ứng dụng,
    // bao gồm cả main.ts và các module khác mà không cần import lại.
    // envFilePath: '.env' chỉ định file chứa biến môi trường.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 2. Thay đổi MongooseModule.forRoot sang MongooseModule.forRootAsync
    // để lấy chuỗi kết nối từ biến môi trường thông qua ConfigService.
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Đảm bảo ConfigModule được import ở đây
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Lấy chuỗi kết nối từ biến môi trường
      }),
      inject: [ConfigService], // Inject ConfigService để có thể sử dụng trong useFactory
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
