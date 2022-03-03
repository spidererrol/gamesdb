import { Schema } from 'mongoose'
import { GameGroup, UserGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GameType } from './Game'
import { GameGroupType } from './GameGroup'
import { UserType } from './User'
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
    }
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
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true,
    }
})
GroupSchema.virtual('users')
    .get(async function (this: GroupType): Promise<UserType[]> {
        let usergroups = await UserGroup.find({ group: this._id })
        return usergroups.map((ug: UserGroupType) => ug.user)
    })
GroupSchema.virtual('groups')
    .get(async function (this: GroupType): Promise<GameType[]> {
        let gamegroups = await GameGroup.find({ group: this._id })
        return gamegroups.map((gg: GameGroupType) => gg.game)
    })
