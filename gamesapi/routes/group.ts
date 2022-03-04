import express from 'express'
import { bindRouterPath, isKnown, log_debug } from '../libs/utils'
import * as actions from '../actions/group'
import { Group } from '../models/games'
import "../libs/type-extensions"

const router = express.Router()

router.param("group", async (req, res, next, group_id) => {
    let group = await Group.findById(group_id)
    if (!isKnown(group)) {
        res.status(404).json({ status: "error", message: "No such group" })
        return
    }
    (req as express.Request).myGroup = group
    next()
})

const bindPath = bindRouterPath.bind(null, router)

bindPath('post', '/create', actions.create)

bindPath('get', '/', actions.getAllPublic)

bindPath('get', '/private', actions.getAllPrivate)

bindPath("get", "/search/:query", actions.quickSearch)

bindPath('get', '/:group/join', actions.join) // Join current user into public group

bindPath('get', '/:group/leave', actions.leave) // Remove current user from group

bindPath('get', '/:group/invite/:user', actions.TODO) // Invite :user into private :group

bindPath('get', '/:group/expel/:user', actions.TODO) // ADMIN ONLY. Remove :user from :group

bindPath('get', '/:group/add/:game', actions.TODO)

bindPath('get', '/:group/remove/:game', actions.TODO)

bindPath('patch', '/:group', actions.update)

export default router