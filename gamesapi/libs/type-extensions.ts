import 'express'
import 'dotenv'
import { UserType } from "../schemas/User"
import { GroupType } from '../schemas/Group'

declare module "express-session" {
    interface Session {
        userId: string
    }
}

declare module "express" {
    interface Request {
        myUser: UserType,
        myGroup: GroupType,
    }
}
