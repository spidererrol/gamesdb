import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'
import { GameType } from './Game'
import { OwnerType, OwnerSchema } from './Owner'
import { VoteType, VoteSchema } from './Vote'


export interface PlayModeType extends DBBase {
    game: GameType
    name: string
    included: boolean
    description?: string
    votes: VoteType[]
    owners: OwnerType[]
}

export const PlayModeSchema = new Schema({
    game: { type: 'ObjectId', ref: 'Game', autopopulate: false }, // I only expect to be retrieving this when I already know the game.
    name: { type: String, required: true, minLength: 1 },
    included: Boolean,
    description: String,
    votes: [{ type: VoteSchema, autopopulate: true }],
    owners: [{ type: OwnerSchema, autopopulate: true }],
})
