import express from 'express'
import { bindRouterPath, setupParams } from '../libs/utils'
import * as actions from '../actions/group'
import "../libs/type-extensions"

const router = express.Router()

setupParams(router)

const bindPath = bindRouterPath.bind(null, router)

bindPath('post', '/create', actions.create)

bindPath('get', '/', actions.getAllPublic)

bindPath('get', '/private', actions.getAllPrivate)

bindPath("get", "/search/:query", actions.quickSearch)

bindPath('get', '/:group/join', actions.join) // Join current user into public group

bindPath('get', '/:group/leave', actions.leave) // Remove current user from group

bindPath('get', '/:group/invite/:user', actions.invite) // Invite :user into private :group

bindPath('get', '/:group/expel/:user', actions.expel) // ADMIN ONLY. Remove :user from :group

bindPath('get', '/:group/add/:game', actions.TODO)

bindPath('get', '/:group/remove/:game', actions.TODO)

bindPath('patch', '/:group', actions.update)

export default router