import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'
import { GroupSchema, GroupType } from './Group'
import { UserSchema, UserType } from './User'

export interface UserGroupType extends DBBase {
    user: UserType,
    group: GroupType,
}

export const UserGroupSchema = new Schema({
    user: { type: UserSchema, autopopulate: true },
    group: { type: GroupSchema, autopopulate: true },
})
