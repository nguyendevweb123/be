import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService, 
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
    @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password } = registerDto;
    return await this.usersService.register(email, password);
  }
}
