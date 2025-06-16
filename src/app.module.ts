// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // THÊM DÒNG NÀY
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
  
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Đảm bảo ConfigModule được import ở đây
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Lấy chuỗi kết nối từ biến môi trường
      }),
      inject: [ConfigService], // Inject ConfigService để có thể sử dụng trong useFactory
    }),
    UsersModule,
    ProductsModule,
     AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
