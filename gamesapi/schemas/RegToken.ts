import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'

export interface RegTokenType extends DBBase {
    token: string,
    registrations?: number,
    expires?: Date,
}

export const RegTokenSchema = new Schema({
    token: { type: String, required: true },
    registrations: Number,
    expires: Date,
})
