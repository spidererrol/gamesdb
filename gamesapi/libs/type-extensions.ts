import 'express'
import 'dotenv'
import { UserType } from "../schemas/User"
import { GroupType } from '../schemas/Group'
import { GameType } from '../schemas/Game'

declare module "express-session" {
    interface Session {
        userId: string
    }
}

declare module "express" {
    interface Request {
        myUser: UserType,
        myGroup: GroupType,
        myGame: GameType,
    }
}

declare module "mongoose" {
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
        nameish(term: any): any,
    }
}