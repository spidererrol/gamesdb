import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'
import { GameType, GameSchema } from './Game'


export interface PlayModeType extends DBBase {
    game: GameType
    name: string
    description?: string
}

export const PlayModeSchema = new Schema({
    game: { type: 'ObjectId', ref: 'Game', autopopulate: false }, // I only expect to be retrieving this when I already know the game.
    name: { type: String, required: true, minLength: 1 },
    description: String,
})
