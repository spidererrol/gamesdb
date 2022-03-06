import { isKnown_type } from "../libs/utils"
import { GameGroup, Games, Group } from "../models/games"
import { GameType } from "../schemas/Game"
import { GameGroupType } from "../schemas/GameGroup"
import { GroupType } from "../schemas/Group"
import { GameGroupMode } from "../types/GameGroupMode"

async function autoGameGroup(game: GameType, group: GroupType): Promise<void> {
    if (group.gameMatches(game)) {
        let gg = await GameGroup.findOne({
            game: game,
            group: group
        })
        if (isKnown_type<GameGroupType>(gg)) {
            // Include = good but with manual override so don't change
            // Auto = ideal but already what I want
            // Exclude = should never happen but if it does then I don't want to change anything.
        } else {
            gg = await GameGroup.create({
                group: group,
                game: game,
                mode_id: GameGroupMode.Auto,
            })
            group.games.push(game)
            await group.save()
        }
    } else {
        if (group.includesGame(game)) {
            await GameGroup.deleteMany({
                group: group,
                game: game,
                mode_id: GameGroupMode.Auto,
            })
            group.games = group.games.filter((g: GameType) => g._id.toString() != game._id.toString())
            await group.save()
        }
    }
}

export async function recalcGroup(group: GroupType): Promise<void> {
    for await (const game of Games.find()) {
        await autoGameGroup(game, group)
    }
}

export async function recalcGame(game: GameType): Promise<void> {
    for await (const group of Group.find()) {
        await autoGameGroup(game, group)
    }
}
