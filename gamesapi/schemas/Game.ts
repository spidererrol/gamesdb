import { Schema } from 'mongoose'
import { log_debug } from '../libs/utils'
import { VoteSchema } from "./Vote"
import { WhenWhoSchema } from './WhenWho'
import { Vote } from '../types/Vote'
import { OwnerSchema } from './Owner'
import { Owned } from '../types/Owned'
import { DBBase } from '../types/DBBase'
import { WhenWhoType } from './WhenWho'
import { VoteType } from './Vote'
import { OwnerType } from "./Owner"

export interface GameType extends DBBase {
    name: string
    aliases: string[]
    tags: string[]
    maxPlayers: number
    minPlaters: number
    links: {}
    votes: VoteType[]
    owners: OwnerType[]
    voteState: {
        count: number
        vote: Vote
    }
    ownedState: {
        count: number
        state: Owned
        maxPrice: number
    }
    added: WhenWhoType
}

export const GameSchema = new Schema({
    name: String,
    aliases: [String],
    tags: [String],
    maxPlayers: Number,
    minPlayers: { type: Number, default: 1 },
    links: {
        type: Map,
        of: String,
    },
    votes: [{ type: VoteSchema, autopopulate: true }],
    owners: [OwnerSchema],
    added: { type: WhenWhoSchema, autopopulate: true },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
GameSchema.query.nameish = function ( term: RegExp | string) {
    let qterm: RegExp
    if (term instanceof RegExp) {
        qterm = term
    } else {
        qterm = new RegExp(term, 'i')
    }
    return this.where({
        $or: [
            { "name": { $regex: qterm } },
            { "aliases": { $regex: qterm } },
            { "tags": { $regex: qterm } },
        ],
    })
}
