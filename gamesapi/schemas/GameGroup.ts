import { Schema } from 'mongoose'
import '../libs/schemainit'
import { isKnown, log_debug } from '../libs/utils'
import { UserGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GameGroupMode, GameGroupModeStrings } from '../types/GameGroupMode'
import { Vote } from '../types/Vote'
import { GameSchema, GameType } from './Game'
import { GroupSchema, GroupType } from './Group'
import { UserGroupType } from './UserGroup'

export interface GameGroupType extends DBBase {
    game: GameType,
    group: GroupType,
    mode_id: GameGroupMode,
    mode: GameGroupModeStrings,
}

export const GameGroupSchema = new Schema({
    game: { type: 'ObjectId', ref: 'Game', autopopulate: true },
    group: { type: 'ObjectId', ref: 'Group', autopopulate: true },
    mode_id: Number,
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
        log_debug(`Get mode`)
        let ret = GameGroupMode[this.mode_id as number]
        log_debug(`==${this.mode_id} => ${ret}`)
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
        log_debug(`==${(this).mode_id}`)
    })
GameGroupSchema.virtual('voteState').get(async function (this: GameGroupType) {
    let groupusers_raw = await UserGroup.find({ group: this._id })
    let groupusers = groupusers_raw.map((gu: UserGroupType) => gu.user._id)
    let votes = this.game.votes.filter(v => groupusers.includes(v.user._id))
    let count = votes.length
    let vote: Vote
    if (votes.filter(v => v.vote_id == Vote.Veto).length > 0) {
        vote = Vote.Veto
    } else if (votes.filter(v => v.vote_id == Vote.Desire).length > 0) {
        vote = Vote.Desire
    } else {
        vote = Vote.Accept
    }
    return {
        count: count,
        vote_id: vote,
        vote: Vote[vote],
    }
})
GameGroupSchema.virtual('ownedState').get(function (this: GameGroupType) {


    //FIXME: update this from Game to GameGroup:
    // let owners = this.owners;
    // let count = owners.length;
    // let owned = owners.filter(o => o.isOwned).length;
    // let installed = owners.filter(o => o.isInstalled).length;
    // let minPrice: number | null = null;
    // if (owners.length >= 1) {
    //     minPrice = owners.filter(o => !o.isOwned).reduce((a, b) => {
    //         if (a.maxPrice <= 0)
    //             return b;
    //         if (a.maxPrice < b.maxPrice)
    //             return a;
    //         return b;
    //     }).maxPrice;
    // }
    // let state: Owned;
    // log_debug(`owned = ${owned}, count = ${count}, installed = ${installed}`);
    // if (installed == count) {
    //     state = Owned.Installed;
    // } else if (count == 0 || owned < count) {
    //     state = Owned.Unowned;
    // } else if (installed < owned) {
    //     state = Owned.Owned;
    // } else {
    //     state = Owned.Installed;
    // }
    // return {
    //     count: count,
    //     state_id: state,
    //     state: Owned[state],
    //     maxPrice: minPrice,
    // };
})
