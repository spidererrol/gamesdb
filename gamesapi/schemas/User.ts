import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'

export interface UserType extends DBBase {
    loginName: string
    crypt: string
    displayName: string
    registered: Date
    isAdmin: boolean
}

export const UserSchema = new Schema({
    loginName: String,
    crypt: String,
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
