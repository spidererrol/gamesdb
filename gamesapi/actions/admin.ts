import '../libs/type-extensions'
import { Games, Users } from '../models/games'
import { GameType } from '../schemas/Game'
import { UserType } from '../schemas/User'
import { update_voted } from './playmode'
import { Request, Response } from 'express'
import { log_debug } from '../libs/utils'

// Helper functions:

// Actions:

export async function recalcGames(req: Request, res: Response) {
    log_debug("Recalculate Games")
    const users: UserType[] = await Users.find()
    const games: GameType[] = await Games.find()
    for (const user of users) {
        for (const game of games) {
            await update_voted(game, user)
        }
    }
    log_debug("Games recalculated")
    res.json({ status: "success" })
}
