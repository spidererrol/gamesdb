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

// Helper functions:

// Actions:

export function test(req: Request, res: Response) {
    throw new Error("TODO")
}