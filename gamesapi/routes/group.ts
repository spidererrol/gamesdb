import express from 'express'
import { bindRouterPath, isKnown, log_debug } from '../libs/utils'
import * as actions from '../actions/group'
import { Group } from '../models/games'
import "../libs/type-extensions"

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

router.param("group", async (req, res, next, group_id) => {
    let group = await Group.findById(group_id)
    if (!isKnown(group)) {
        res.status(404).json({ status: "error", message: "No such group" })
        return
    }
    (req as express.Request).myGroup = group
    next()
})

bindPath('post', '/create', actions.create)

bindPath('patch', '/:group', actions.update)

bindPath('get', '/', actions.getAllPublic)

bindPath('get', '/private', actions.getAllPrivate)

export default router