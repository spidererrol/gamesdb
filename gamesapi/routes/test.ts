import express from 'express'
import { bindRouterPath } from '../libs/utils'
import * as actions from '../actions/test'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

// bindPath('patch','/update',auth_actions.update);
bindPath("get", "/", actions.test)

export default router