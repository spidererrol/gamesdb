import { Request, Response } from 'express'
import { Games } from '../models/games'
import { Owned } from "../types/Owned"
import { Vote } from "../types/Vote"
import { handleError, log_debug, isKnown } from '../libs/utils'
import { GameType } from "../schemas/Game"
import { OwnerType } from "../schemas/Owner"
import { VoteType } from "../schemas/Vote"
import config from '../libs/config'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'

// Helper functions:

// Actions:

export function test(req: Request, res: Response) {
    res.status(HTTPSTATUS.NOT_IMPLEMENTED).json({
        status: "error", message: "Not yet implemented"
    })
}