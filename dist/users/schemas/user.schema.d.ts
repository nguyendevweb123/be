import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password: string;
    role: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export interface User extends Document {
    _id: string;
    email: string;
    password: string;
    role: string;
}
