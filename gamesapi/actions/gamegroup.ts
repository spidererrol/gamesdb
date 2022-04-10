import { Request, Response } from 'express'
import { idString, isKnown_type, log_debug } from "../libs/utils"
import { GameGroup, Games, Group } from "../models/games"
import { GameType } from "../schemas/Game"
import { GameGroupType } from "../schemas/GameGroup"
import { GroupType } from "../schemas/Group"
import { GameGroupMode } from "../types/GameGroupMode"
import { isKnown, err404 } from '../libs/utils'
import '../libs/type-extensions'

function debug(message: any, ...args: any[]) {
    console.log(message, ...args)
}

async function autoGameGroup(game: GameType, group: GroupType, force?: true): Promise<void> {
    debug("group:", group._id, "game:", game._id)
    debug("group:", group.name, "game:", game.name)

    if (await group.gameMatches(game)) {
        debug("Match: hit")
        let gg = await GameGroup.findOne({
            game: game,
            group: group
        })
        if (isKnown_type<GameGroupType>(gg)) {
            debug("Already included")
            // Include = good but with manual override so don't change
            // Auto = ideal but already what I want
            // Exclude = should never happen but if it does then I don't want to change anything.
            if (force) {
                if (!group.games.map(g => idString(g)).includes(idString(game)))
                    group.games.push(game)
            }
        } else {
            debug("Add group")
            gg = await GameGroup.create({
                group: group,
                game: game,
                mode_id: GameGroupMode.Auto,
            })
            debug("Push to group")
            group.games.push(game)
            await group.save()
        }
    } else {
        debug("Match miss")
        if (group.includesGame(game)) {
            debug("Remove Game")
            await GameGroup.deleteMany({
                group: group,
                game: game,
                mode_id: GameGroupMode.Auto,
            })
            debug("Filter from group")
            group.games = group.games.filter((g: GameType) => idString(g) != idString(game))
            await group.save()
        } else {
            debug("Already removed")
            if (force) {
                group.games = group.games.filter((g: GameType) => idString(g) != idString(game))
            }
        }
    }
}

export async function recalcGroup(group: GroupType, force?: true): Promise<void> {
    for await (const game of Games.find()) {
        await autoGameGroup(game, group, force)
    }
}

export async function recalcGame(game: GameType, force?: true): Promise<void> {
    for await (const group of Group.find()) {
        await autoGameGroup(game, group, force)
    }
}

export async function get(req: Request, res: Response) {
    log_debug("Got GameGroup Request")
    let gameGroup = await GameGroup.findOne({
        game: req.reqGame,
        group: req.reqGroup
    })
    if (!isKnown(gameGroup))
        err404(res, "GameGroup")
    log_debug("Success")
    let ret = { ...gameGroup.toObject() }
    ret["voteState"] = await gameGroup.voteState()
    ret["ownedState"] = await gameGroup.ownedState()
    res.json({ status: "success", gamegroup: ret })
}