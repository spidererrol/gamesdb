import 'express'
import 'dotenv'
import { UserType } from "../schemas/User"
import { GroupType } from '../schemas/Group'
import { GameType } from '../schemas/Game'
import { PlayModeType } from '../schemas/PlayMode'
import { PlayModeProgressType } from '../schemas/PlayModeProgress'

declare module "express-session" {
    interface Session {
        userId: string
    }
}

declare module "express" {
    interface Request {
        myUser: UserType,
        reqUser: UserType,
        reqGroup: GroupType,
        reqGame: GameType,
        reqPlayMode: PlayModeType,
        reqPlayModeProgress: PlayModeProgressType,
    }
}

declare module "mongoose" {
    interface Query<ResultType, DocType, THelpers, RawDocType> {
        nameish(term: any, arg?: any): Query<ResultType, DocType, THelpers, RawDocType>,
    }
}