import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'
import { UserType } from './User'

export interface OwnerType extends DBBase {
    user: UserType
    ownedSince?: Date
    installedSince?: Date
    maxPrice: number
    isOwned: boolean
    isInstalled: boolean
}

export const OwnerSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User', autopopulate: true, required: true },
    ownedSince: Date,
    installedSince: Date,
    maxPrice: Number,
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
OwnerSchema.virtual('isOwned').get(function (this: OwnerType) {
    return this.ownedSince !== null && this.ownedSince !== undefined
})
OwnerSchema.virtual('isInstalled').get(function (this: OwnerType) {
    return this.installedSince !== null && this.installedSince !== undefined
})
