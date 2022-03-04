import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'
import { UserType } from './User'

export interface ShadowType extends DBBase {
    loginName: string
    crypt: string
    user: UserType
}

export const ShadowSchema = new Schema({
    loginName: String,
    crypt: String,
    user: { type: 'ObjectId', ref: 'User', autopopulate: true }
}, {
    toJSON: {
        transform: (_doc, ret, _optoins) => {
            delete ret.crypt
            return ret
        }
    }
})
