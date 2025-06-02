import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<import("./schemas/user.schema").User>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        access_token: string;
    }>;
}
