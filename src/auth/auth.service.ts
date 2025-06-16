import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user as any
     return {
  _id: user._id,
  email: user.email,
  role: user.role, // 👈 thêm dòng này
};
    }
    throw new UnauthorizedException('Email hoặc mật khẩu sai')
  }

  async login(user: any) {
  const payload = { email: user.email, _id: user._id, role: user.role };
  return {
  access_token: this.jwtService.sign(payload,
    {  secret: process.env.JWT_SECRET || 'my_very_secure_key',
      expiresIn: '1d',}), // Trả về access_token
  };
}

}
