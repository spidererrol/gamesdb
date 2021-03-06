import express from 'express'
import { bindRouterPath } from '../libs/utils'
import * as auth_actions from '../actions/auth'
import * as user_actions from '../actions/user'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath('patch', '/update', auth_actions.update)

bindPath('get', '/memberships', user_actions.memberships)

bindPath('get', '/search/:query', user_actions.quickSearch)

bindPath('post', '/regtoken', auth_actions.addRegToken)
bindPath('get', '/regtoken', auth_actions.getRegTokens)

bindPath('get', '/all', user_actions.getAll)

bindPath('get', '/', user_actions.get)

export default router