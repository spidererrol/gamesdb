import { DBBase } from '../types/DBBase'
import { Schema } from 'mongoose'

// This needs to be in a seperate file to prevent recursive imports between utils and Group

export interface RangeFilterType extends DBBase {
    above: number
    below: number
}

export const RangeFilterSchema = new Schema({
    above: Number,
    below: Number,
})

