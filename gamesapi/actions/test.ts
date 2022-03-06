import { Request, Response } from 'express'
import { Games } from '../models/games'
import { Owned } from "../types/Owned"
import { Vote } from "../types/Vote"
import { handleError, log_debug, isKnown, errorResponse } from '../libs/utils'
import { GameType } from "../schemas/Game"
import { OwnerType } from "../schemas/Owner"
import { VoteType } from "../schemas/Vote"
import config from '../libs/config'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'

// Helper functions:

// Actions:

export async function TODO(req: Request, res: Response) {
    log_debug("TODO")
    errorResponse(res,HTTPSTATUS.NOT_IMPLEMENTED,"This function has not been implemented yet!")
}
