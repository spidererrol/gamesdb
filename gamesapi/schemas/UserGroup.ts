import { Schema } from 'mongoose'
import '../libs/schemainit'
import { DBBase } from '../types/DBBase'
import { GroupSchema, GroupType } from './Group'
import { UserSchema, UserType } from './User'

export interface UserGroupType extends DBBase {
    user: UserType,
    group: GroupType,
}

export const UserGroupSchema = new Schema({
    user:  { type: 'ObjectId', ref: 'User', autopopulate: true },
    group:  { type: 'ObjectId', ref: 'Group', autopopulate: true },
})
