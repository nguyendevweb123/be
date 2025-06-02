import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.create(body.name, body.email, body.password);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.usersService.login(body.email, body.password);
    
    if (!result) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return {
      message: 'Đăng nhập thành công',
      access_token: result.access_token,
    };
  }
}
