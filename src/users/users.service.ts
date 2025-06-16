import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); // 👈 thêm dòng này

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    //phân quyền dựa trên đuôi của email
    const role = email.endsWith('@admin.com') ? 'admin' : 'user';
    const createdUser = new this.userModel({ 
      name, 
      email, 
      password: hashedPassword,
      role,
     });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async login(email: string, password: string): Promise<{ access_token: string; role: string } | null> {
  const user = await this.userModel.findOne({ email }).exec();
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const payload = { email: user.email, sub: user._id, role: user.role };
  const access_token = await this.jwtService.signAsync(payload);
  return { access_token, role: user.role };
}


  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async register(email: string, password: string): Promise<{ message: string }> {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Email đã tồn tại');
      }

      await this.create('', email, password); // name = ''
      return { message: 'Đăng ký thành công' };
    } catch (err) {
      this.logger.error('Lỗi đăng ký:', err.message, err.stack);
      throw err;
    }
  }
}
