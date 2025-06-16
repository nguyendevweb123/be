import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

  @Get('dashboard')
  @Roles('admin') // 👈 Chỉ admin mới truy cập
  getDashboard() {
    return { message: 'Welcome to Admin Dashboard' };
  }
}
