import { Schema } from 'mongoose'
import '../libs/schemainit'
import { VoteSchema } from "./Vote"
import { WhenWhoSchema } from './WhenWho'
import { OwnerSchema } from './Owner'
import { DBBase } from '../types/DBBase'
import { WhenWhoType } from './WhenWho'
import { VoteType } from './Vote'
import { OwnerType } from "./Owner"
import { UserType } from './User'

export interface GameType extends DBBase {
    name: string
    aliases: string[]
    tags: string[]
    maxPlayers: number
    minPlayers: number
    links: Map<string, string>//{ [index: string]: string }
    votes: VoteType[]
    owners: OwnerType[]
    added: WhenWhoType
    voted: UserType[]
    release?: Date
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
    owners: [{ type: OwnerSchema, autopopulate: true }],
    added: { type: WhenWhoSchema, autopopulate: true },
    voted: [{ type: 'ObjectId', ref: 'User', autopopulate: true }],
    release: { type: Date },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
GameSchema.query.nameish = function (term: RegExp | string) {
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
