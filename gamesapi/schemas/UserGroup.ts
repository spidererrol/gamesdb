import { Schema } from 'mongoose'
import '../libs/schemainit'
import { isKnown } from '../libs/utils'
import { Group } from '../models/games'
import { DBBase } from '../types/DBBase'
import { GroupSchema, GroupType } from './Group'
import { UserSchema, UserType } from './User'

export interface UserGroupType extends DBBase {
    user: UserType,
    group: GroupType,
    private: boolean,
}

export const UserGroupSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User', autopopulate: true },
    group: { type: 'ObjectId', ref: 'Group', autopopulate: true },
    private: Boolean,
})
UserGroupSchema.pre('save', async function (this: any) {
    let group
    if (isKnown(this.group)) {
        if (typeof this.group === 'string') {
            group = await Group.findById(this.group)
        } else if (this.group instanceof Schema.Types.ObjectId) {
            group = await Group.findById(this.group.toString())
        } else {
            group = this.group
        }
        if (isKnown(group)) {
            this.private = group.private
        }
    }
})