import mongoose from 'mongoose'
import { GameSchema } from "../schemas/Game"
import { GameGroupSchema } from '../schemas/GameGroup'
import { GroupSchema } from '../schemas/Group'
import { LoginSchema } from "../schemas/Login"
import { PlayModeSchema } from '../schemas/PlayMode'
import { PlayModeProgressSchema } from '../schemas/PlayModeProgress'
import { ShadowSchema } from '../schemas/Shadow'
import { UserSchema } from "../schemas/User"
import { UserGroupSchema } from '../schemas/UserGroup'

export const Users = mongoose.model('User', UserSchema)
export const Shadow = mongoose.model('Shadow', ShadowSchema)
export const Login = mongoose.model('Login', LoginSchema)
export const Games = mongoose.model('Game', GameSchema)
export const Group = mongoose.model('Group', GroupSchema)
export const UserGroup = mongoose.model('UserGroup', UserGroupSchema)
export const GameGroup = mongoose.model('GameGroup', GameGroupSchema)
export const PlayMode = mongoose.model('PlayMode', PlayModeSchema)
export const PlayModeProgress = mongoose.model('PlayModeProgress', PlayModeProgressSchema)
