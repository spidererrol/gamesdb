import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'
import { UserType } from "./User"

export interface LoginType extends DBBase {
    token: string
    user: UserType
    expires: Date
}

export const LoginSchema = new Schema({
    token: String,
    user: { type: 'ObjectId', ref: 'User', autopopulate: true },
    expires: { type: Date, default: Date.now }
})
