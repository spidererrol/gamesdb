import express from 'express'
import { bindRouterPath, isKnown, log_debug } from '../libs/utils'
import * as actions from '../actions/group'
import { Group } from '../models/games'
import "../libs/type-extensions"

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath('post', '/create', actions.create)

bindPath('patch', '/:group', actions.update)

bindPath('get', '/', actions.getAllPublic)

bindPath('get', '/private', actions.getAllPrivate)

bindPath('get','/:group/join',actions.TODO) // Join current user into public group

bindPath('get','/:group/leave',actions.TODO) // Remove current user from group

bindPath('get','/:group/invite/:user',actions.TODO) // Invite :user into private :group

bindPath('get','/:group/expel/:user',actions.TODO) // ADMIN ONLY. Remove :user from :group

bindPath('get','/:group/add/:game',actions.TODO)

bindPath('get','/:group/remove/:game',actions.TODO)

export default router