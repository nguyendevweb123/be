import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password', async () => {
    const mockSave = jest.fn().mockResolvedValue({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed123',
    });

    const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed123' as never);

    // Tạo instance thủ công như trong service: new this.userModel(...)
    const userModelConstructorMock = jest.fn().mockImplementation(() => ({
      save: mockSave,
    }));

    const testModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModelConstructorMock },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    const service = testModule.get<UsersService>(UsersService);

    const result = await service.create('Alice', 'alice@example.com', '123456');

    expect(hashSpy).toHaveBeenCalledWith('123456', 10);
    expect(mockSave).toHaveBeenCalled();
    expect(result.email).toBe('alice@example.com');
  });

  it('should return all users', async () => {
    const users = [{ name: 'Bob' }, { name: 'Carol' }];
    mockUserModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(users),
    });

    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  it('should return access_token if login is correct', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedpassword',
      _id: '123',
    };

    mockUserModel.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    mockJwtService.signAsync.mockResolvedValue('test_token');

    const result = await service.login('test@example.com', 'password123');
    expect(result).toEqual({ access_token: 'test_token' });
  });

  it('should return null if email is not found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const result = await service.login('notfound@example.com', 'password');
    expect(result).toBeNull();
  });

  it('should return null if password does not match', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    mockUserModel.findOne.mockResolvedValue(mockUser);
   jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
    const result = await service.login('test@example.com', 'wrongpass');
    expect(result).toBeNull();
  });
});
