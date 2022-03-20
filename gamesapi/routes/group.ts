import express from 'express'
import { bindRouterPath, setupParams } from '../libs/utils'
import * as actions from '../actions/group'
import * as pmp_actions from '../actions/playmodeprogress'
import * as gg_actions from '../actions/gamegroup'
import "../libs/type-extensions"

const router = express.Router()

setupParams(router)

const bindPath = bindRouterPath.bind(null, router)

bindPath('post', '/create', actions.create)

bindPath('get', '/', actions.getAllPublic)

bindPath('get', '/private', actions.getAllPrivate)

bindPath('get', '/available', actions.getGroupsForMe)

bindPath("get", "/search/:query", actions.quickSearch)

bindPath('get', '/:group/join', actions.join) // Join current user into public group

bindPath('get', '/:group/leave', actions.leave) // Remove current user from group

bindPath('get', '/:group/progress/:playmode', pmp_actions.getProgress)
bindPath('post', '/:group/progress/:playmode', pmp_actions.setProgress)
bindPath('patch', '/:group/progress/:playmode', pmp_actions.setProgress)
bindPath('get', '/:group/progress', actions.TODO) //TODO: get all progresses?

bindPath('get', '/:group/invite/:user', actions.invite) // Invite :user into private :group

bindPath('get', '/:group/expel/:user', actions.expel) // ADMIN ONLY. Remove :user from :group

bindPath('get', '/:group/add/:game', actions.includeGame)

bindPath('get', '/:group/remove/:game', actions.excludeGame)

bindPath('get', '/:group/:game', gg_actions.get)

bindPath('get', '/:group', actions.get)
bindPath('patch', '/:group', actions.update)
bindPath('delete', '/:group', actions.del)

export default router