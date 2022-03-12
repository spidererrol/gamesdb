import { Schema } from 'mongoose'
import '../libs/schemainit'
import { isKnown, log_debug } from '../libs/utils'
import { UserGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GameGroupMode, GameGroupModeStrings } from '../types/GameGroupMode'
import { Owned } from '../types/Owned'
import { Vote } from '../types/Vote'
import { GameType } from './Game'
import { GroupType } from './Group'
import { PlayModeProgressSchema, PlayModeProgressType } from './PlayModeProgress'
import { UserGroupType } from './UserGroup'

export interface GameGroupType extends DBBase {
    game: GameType,
    group: GroupType,
    mode_id: GameGroupMode,
    mode: GameGroupModeStrings,
    playmodes: PlayModeProgressType[],
    voteState: { 
        count: number,
        vote_id: Vote,
        vote: string,
    },
    ownedState: { 
        count: number,
        state_id: Owned,
        state: string,
        maxPrice: number,
    }
}

export const GameGroupSchema = new Schema({
    game: { type: 'ObjectId', ref: 'Game', autopopulate: true },
    group: { type: 'ObjectId', ref: 'Group', autopopulate: true },
    mode_id: Number,
    playmodes: [{ type: PlayModeProgressSchema, autopopulate: true }],
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
GameGroupSchema.virtual('mode')
    .get(function (this: any): string {
        // log_debug(`Get mode`)
        let ret = GameGroupMode[this.mode_id as number]
        // log_debug(`==${this.mode_id} => ${ret}`)
        return ret
    })
    .set(function (this: any, v: number | string) {
        // let thisthis = JSON.stringify(this);
        // log_debug(`Set vote = ${v} on ${thisthis}`);
        if (typeof v === 'number') {
            if (!isKnown(GameGroupMode[v]))
                throw new Error("Invalid mode!");
            (this).mode_id = v
        } else {
            let mode_id = GameGroupMode[v as keyof typeof GameGroupMode] as number
            if (!isKnown(mode_id))
                throw new Error("Invalid mode!");
            (this).mode_id = mode_id
        }
        // log_debug(`==${(this).mode_id}`)
    })
GameGroupSchema.methods.voteState = async function (this: GameGroupType) {
    // log_debug("gen voteState")
    let groupusers_raw = await UserGroup.find({ group: this.group })
    let groupusers = groupusers_raw.map((gu: UserGroupType) => gu.user._id.toString())
    let votes = this.game.votes.filter(v => groupusers.includes(v.user._id.toString()))
    let count = votes.length
    let vote: Vote
    if (votes.filter(v => v.vote_id == Vote.Veto).length > 0) {
        vote = Vote.Veto
    } else if (votes.filter(v => v.vote_id == Vote.Desire).length > 0) {
        vote = Vote.Desire
    } else {
        vote = Vote.Accept
    }
    let out = {
        count: count,
        vote_id: vote,
        vote: Vote[vote],
    }
    // log_debug(out)
    return out
}
GameGroupSchema.methods.ownedState = async function (this: GameGroupType) {
    let groupusers_raw = await UserGroup.find({ group: this.group })
    let groupusers = groupusers_raw.map((gu: UserGroupType) => gu.user._id.toString())
    let owners = this.game.owners.filter(o => groupusers.includes(o.user._id.toString()))
    let count = owners.length
    let owned = owners.filter(o => o.isOwned).length
    let installed = owners.filter(o => o.isInstalled).length
    let minPrice: number | null = null
    if (owners.length >= 1) {
        minPrice = owners.filter(o => !o.isOwned).reduce((a, b) => {
            if (a.maxPrice <= 0)
                return b
            if (a.maxPrice < b.maxPrice)
                return a
            return b
        }).maxPrice
    }
    let state: Owned
    // log_debug(`GameGroup.ownedState : owned = ${owned}, count = ${count}, installed = ${installed}`)
    if (installed == count) {
        state = Owned.Installed
    } else if (count == 0 || owned < count) {
        state = Owned.Unowned
    } else if (installed < owned) {
        state = Owned.Owned
    } else {
        state = Owned.Installed
    }
    return {
        count: count,
        state_id: state,
        state: Owned[state],
        maxPrice: minPrice,
    }
}
