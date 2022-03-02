import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'
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
    private: Boolean,
    added: { type: WhenWhoSchema, autopopulate: true },
    filters: {
        minPlayers: { type: RangeFilterSchema, autopopulate: true },
        maxPlayers: { type: RangeFilterSchema, autopopulate: true },
        includeTags: [String],
        excludeTags: [String],
    }
})
