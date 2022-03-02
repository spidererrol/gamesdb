import express from 'express'
import { bindRouterPath } from '../libs/utils'
import * as auth_actions from '../actions/auth'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath('patch', '/update', auth_actions.update)

export default router