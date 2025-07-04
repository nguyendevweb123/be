import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private userModel;
    private jwtService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    create(name: string, email: string, password: string): Promise<User>;
    findAll(): Promise<User[]>;
    login(email: string, password: string): Promise<{
        access_token: string;
        role: string;
    } | null>;
    findByEmail(email: string): Promise<User | null>;
    register(email: string, password: string): Promise<{
        message: string;
    }>;
}
