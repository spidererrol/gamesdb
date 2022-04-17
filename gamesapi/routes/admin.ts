import express from 'express'
import { bindRouterPath } from '../libs/utils'
import * as actions from '../actions/admin'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath("get", "/recalcGames", actions.recalcGames)

export default router