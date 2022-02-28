import 'express';
import 'dotenv';
import { UserType } from '../types/games';

declare module "express-session" {
    interface Session {
        userId: string;
    }
}

declare module "express" {
    interface Request {
        myUser: UserType;
    }
}
