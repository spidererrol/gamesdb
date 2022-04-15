import express from 'express'
import { bindRouterPath } from '../libs/utils'
import * as actions from '../actions/auth'
import { getAll } from '../actions/user'
import config from '../libs/config'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath('post', '/login', actions.login)
if (config.DEBUG) {
    bindPath('get', '/debuglogin', getAll)
    bindPath('post', '/debuglogin', actions.debugLogin)
}

bindPath('post', '/register', actions.register)

// bindPath('patch','/register',actions.update); // Moved to: PATCH /user/update

bindPath('get', '/logout', actions.logout)

export default router