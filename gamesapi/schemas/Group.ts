import { Schema } from 'mongoose'
import '../libs/schemainit'
import { isKnown } from '../libs/utils'
import { GameGroup, UserGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GameSchema, GameType } from './Game'
import { GameGroupType } from './GameGroup'
import { UserSchema, UserType } from './User'
import { UserGroupType } from './UserGroup'
import { WhenWhoType, WhenWhoSchema } from './WhenWho'

export interface RangeFilterType extends DBBase {
    above: number,
    below: number,
}

export interface GroupType extends DBBase {
    name: string,
    description: string,
    private: boolean,
    added: WhenWhoType,
    filters: {
        minPlayers: RangeFilterType,
        maxPlayers: RangeFilterType,
        includeTags: String[],
        excludeTags: String[],
    },
    members: UserType[], // Duplicates UserGroup but wanted for searching for private groups
    included: GameType[], // Duplicates GameGroup, don't know if I need it.

    isMember(user: UserType): boolean,
}

export const RangeFilterSchema = new Schema({
    above: Number,
    below: Number,
})

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
GroupSchema.query.nameish = function (term: RegExp | string, user?: UserType) {
    let qterm: RegExp
    if (term instanceof RegExp) {
        qterm = term
    } else {
        qterm = new RegExp(term, 'i')
    }
    if (isKnown(user)) {
        return this.where({
            "name": { $regex: qterm },
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
        return this.where({
            "name": { $regex: qterm },
        })
    }
}
