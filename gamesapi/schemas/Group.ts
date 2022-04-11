import { Schema } from 'mongoose'
import '../libs/schemainit'
import { gameMatcher, inRange, intersect, isKnown, isKnown_type, quotemeta } from '../libs/utils'
import { GameGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GameGroupMode } from '../types/GameGroupMode'
import { GameSchema, GameType } from './Game'
import { GameGroupType } from './GameGroup'
import { RangeFilterSchema, RangeFilterType } from './RangeFilter'
import { UserSchema, UserType } from './User'
import { WhenWhoType, WhenWhoSchema } from './WhenWho'

export interface GroupType extends DBBase {
    name: string,
    description: string,
    private: boolean,
    added: WhenWhoType,
    filters: {
        minPlayers: RangeFilterType,
        maxPlayers: RangeFilterType,
        includeTags: string[],
        excludeTags: string[],
    },
    members: UserType[], // Duplicates UserGroup but wanted for searching for private groups
    games: GameType[], // Duplicates GameGroup, don't know if I need it.

    isMember(user: UserType): boolean,
    includesGame(game: GameType): boolean,
    gameMatches(game: GameType): Promise<boolean>,
}

export const GroupSchema = new Schema({
    name: String,
    description: String,
    private: { type: Boolean, default: false },
    added: { type: WhenWhoSchema, autopopulate: true },
    filters: {
        minPlayers: { type: RangeFilterSchema, autopopulate: true },
        maxPlayers: { type: RangeFilterSchema, autopopulate: true },
        includeTags: [String],
        excludeTags: [String],
    },
    members: [{ type: UserSchema, autopopulate: true }],
    games: [{ type: GameSchema, autopopulate: true }],
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true,
    }
})
// Already added real mappings for these to allow searching!
// GroupSchema.virtual('users')
//     .get(async function (this: GroupType): Promise<UserType[]> {
//         try {
//             let usergroups = await UserGroup.find({ group: this })
//             return usergroups.map((ug: UserGroupType) => ug.user)
//         } catch (err) {
//             return []
//         }
//     })
// GroupSchema.virtual('games')
//     .get(async function (this: GroupType): Promise<GameType[]> {
//         try {
//             let gamegroups = await GameGroup.find({ group: this })
//             return gamegroups.map((gg: GameGroupType) => gg.game)
//         }
//         catch (err) {
//             return []
//         }
//     })
GroupSchema.methods.isMember = function (this: GroupType, user: UserType): boolean {
    return this.members.map((u: UserType) => u._id.toString()).includes(user._id.toString())
}
GroupSchema.methods.includesGame = function (this: GroupType, game: GameType): boolean {
    return this.games.map((g: GameType) => g._id.toString()).includes(game._id.toString())
}
function why(state: boolean, message: string): boolean {
    console.log("gameMatches:" + message + " => " + state)
    return state
}
GroupSchema.methods.gameMatches = async function (this: GroupType, game: GameType): Promise<boolean> {
    let gg = await GameGroup.findOne({
        game: game,
        group: this
    })
    if (isKnown_type<GameGroupType>(gg)) {
        console.log("🚀 ~ file: Group.ts ~ line 89 ~ gg.mode_id", gg.mode_id, GameGroupMode[gg.mode_id])
        if (gg.mode_id == GameGroupMode.Exclude)
            return why(false, "already excluded")
        if (gg.mode_id == GameGroupMode.Include)
            return why(true, "already included")
    }
    return gameMatcher(this,game).logret()
    // if (isKnown(this.filters.excludeTags) && intersect(this.filters.excludeTags, game.tags))
    //     return why(false, "exclude by tag")
    // if (!inRange(this.filters.minPlayers, game.minPlayers))
    //     return why(false, "exclude by minPlayers")
    // if (!inRange(this.filters.maxPlayers, game.maxPlayers))
    //     return why(false, "exclude by maxPlayers")
    // if (isKnown(this.filters.includeTags) && this.filters.includeTags.length > 0)
    //     return why(intersect(this.filters.includeTags, game.tags), "includeTags")
    // // return why(false, "include by tag")
    // return why(true, "default")
}
GroupSchema.query.nameish = function (term: RegExp | string, user?: UserType) {
    let qterm: RegExp
    if (term instanceof RegExp) {
        qterm = term
    } else {
        qterm = new RegExp(quotemeta(term), 'i')
    }
    let query = this.where({
        $or: [
            { "name": { $regex: qterm } },
            { "description": { $regex: qterm } }
        ]
    })
    if (isKnown(user)) {
        return query.and({
            $or: [
                {
                    "private": false,
                },
                {
                    "members._id": (user as UserType)._id,
                }
            ],
        })
    } else {
        return query
    }
}
GroupSchema.query.find_conflict = function (term: RegExp | string) {
    let qterm: RegExp
    if (term instanceof RegExp) {
        qterm = term
    } else {
        qterm = new RegExp(quotemeta(term), 'i')
    }
    return this.where({
        "name": { $regex: qterm }
    })
}