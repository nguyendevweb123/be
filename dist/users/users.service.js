"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let UsersService = UsersService_1 = class UsersService {
    userModel;
    jwtService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async create(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email.endsWith('@admin.com') ? 'admin' : 'user';
        const createdUser = new this.userModel({
            name,
            email,
            password: hashedPassword,
            role,
        });
        return createdUser.save();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async login(email, password) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return null;
        const payload = { email: user.email, sub: user._id, role: user.role };
        const access_token = await this.jwtService.signAsync(payload);
        return { access_token, role: user.role };
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async register(email, password) {
        try {
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new common_1.BadRequestException('Email đã tồn tại');
            }
            await this.create('', email, password);
            return { message: 'Đăng ký thành công' };
        }
        catch (err) {
            this.logger.error('Lỗi đăng ký:', err.message, err.stack);
            throw err;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map