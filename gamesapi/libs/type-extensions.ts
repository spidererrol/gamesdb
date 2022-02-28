import 'express';
import 'dotenv';

declare module "express-session" {
    interface Session {
        userId: string;
    }
}

declare module "express" {
    interface Request {
        myUser: any; // I don't have a type definition for User.
    }
}
