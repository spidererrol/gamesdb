import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'

export interface UserType extends DBBase {
    loginName: string
    displayName: string
    registered: Date
    isAdmin: boolean
}

export const UserSchema = new Schema({
    loginName: String,
    displayName: String,
    registered: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
}, {
    toJSON: {
        transform: (_doc, ret, _optoins) => {
            delete ret.crypt
            return ret
        }
    }
})
