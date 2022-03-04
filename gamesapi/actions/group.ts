import { Request, Response } from 'express'
import { Group, UserGroup } from '../models/games'
import { handleError, log_debug, isKnown, errorResponse } from '../libs/utils'
import '../libs/type-extensions'
import { GroupType } from '../schemas/Group'
import config from '../libs/config'
import { UserGroupType } from '../schemas/UserGroup'
import { HTTPSTATUS } from '../types/httpstatus'
import { UserType } from '../schemas/User'

// Helper functions:

async function getList(query: any, limit: number = config.PAGELIMIT, res?: Response): Promise<any> {
    const list = await query.limit(limit + 1)
    return getRawList(list, limit, res)
}

function getRawList(list: any, limit: number, res?: Response<any, Record<string, any>>) {
    const more: boolean = list.length > limit
    const ret = { status: "success", groups: list.slice(0, limit), more: more }
    res?.json(ret)
    return ret
}

function err404(res: Response) {
    res.status(404).json({ status: "error", message: "Game not found" })
}

// Actions:

export async function TODO(req: Request, res: Response) {
    log_debug("TODO")
    res.status(500).json({ status: "error", message: "This function has not been implemented yet!" })
}

export async function getAllPublic(req: Request, res: Response) {
    log_debug("Request all public groups")
    try {
        getList(Group.find({ private: false, }), config.PAGELIMIT, res)
    } catch (err) {
        handleError(err, res)
    }
}

export async function getAllPrivate(req: Request, res: Response) {
    log_debug("Request all (available) private groups")
    try {
        let ugs = await UserGroup.find({
            user: req.myUser
        }).limit(config.PAGELIMIT + 1)
        getRawList(ugs.map((ug: UserGroupType) => ug.group).filter((g: GroupType) => g.private), config.PAGELIMIT, res)
    } catch (err) {
        handleError(err, res)
    }
}

export async function create(req: Request, res: Response) {
    try {
        if (!isKnown(req.body.name)) {
            res.status(406).json({ status: "error", message: "name is required" })
            return
        }
        let existing = await Group.findOne().nameish(req.body.name)
        //.findOne({ name: req.body.name })
        if (isKnown(existing)) {
            res.status(409).json({ status: "error", message: "Group already exists", group: existing })
            return
        }
        let group = new Group(req.body)
        group.members.push(req.myUser)
        let dbGroup = await group.save()
        let join = new UserGroup({
            user: req.myUser,
            group: dbGroup
        })
        let dbJoin = await join.save()
        res.json({ group: dbGroup, status: "success", membership: dbJoin, myUser: req.myUser })
    } catch (error) {
        handleError(error, res)
    }
}

export async function update(req: Request, res: Response) {
    log_debug(`Update group (${req.params.group})`)
    try {
        let result = await req.reqGroup.updateOne({
            "$set": req.body
        })
        const after = await Group.findById(req.params.group)
        res.json({ status: "success", result: result, before: req.reqGroup, after: after })
    } catch (error) {
        handleError(error, res)
    }
}

export async function quickSearch(req: Request, res: Response) {
    let query: string = req.params.query
    log_debug(`Quick search for ${query}`)
    let q = Group.find().nameish(req.params.query, req.myUser)
    getList(q, config.PAGELIMIT, res)
}

export async function join(req: Request, res: Response) {
    log_debug(`Join`)
    try {
        if (req.reqGroup.private) {
            res.status(HTTPSTATUS.FORBIDDEN).json({ status: "error", message: "Group is private" })
            return
        }
        let usergroup: UserGroupType
        let ugs = await UserGroup.find({
            user: req.myUser,
            group: req.reqGroup
        })
        if (ugs.length > 0) {
            log_debug("Already in group")
            res.status(HTTPSTATUS.CONFLICT).json({ status: "error", message: "Already a member" })
            return
        } else {
            usergroup = await UserGroup.create({
                user: req.myUser,
                group: req.reqGroup
            })
            req.reqGroup.members.push(req.myUser)
        }
        await req.reqGroup.save()
        res.json({ status: "success", usergroup: usergroup })
    } catch (err) {
        handleError(err, res)
    }
}

export async function leave(req: Request, res: Response) {
    log_debug(`Leave`)
    try {
        let ug = await UserGroup.findOne({
            user: req.myUser,
            group: req.reqGroup
        })
        if (!isKnown(ug)) {
            res.status(HTTPSTATUS.NOT_FOUND).json({
                status: "error", message: "Not a member",
                //  ug: ug, g: req.reqGroup, u: req.myUser
            })
            return
        }
        await UserGroup.findByIdAndDelete(ug._id)
        req.reqGroup.members = req.reqGroup.members.filter((u) => u._id.toString() != req.myUser._id.toString())
        await req.reqGroup.save()
        if (req.reqGroup.private && req.reqGroup.members.length == 0) {
            await Group.findByIdAndDelete(req.reqGroup._id)
            res.json({ status: "success", message: "Group removed" })
            return
        }
        res.json({ status: "success", message: "Group left" })
    } catch (error) {
        handleError(error, res)
    }
}

export async function invite(req: Request, res: Response) {
    log_debug(`Invite`)
    try {
        if (!req.reqGroup.private) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Group is public. User can join at will.")
        }
        if (req.reqUser._id.toString() == req.myUser._id.toString()) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "You can't invite yourself to a group")
        }
        if (!req.reqGroup.isMember(req.myUser)) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "You are not a member of group")
        }
        if (req.reqGroup.isMember(req.reqUser)) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "User is already a member")
        }
        let usergroup = await UserGroup.create({
            user: req.reqUser,
            group: req.reqGroup
        })
        req.reqGroup.members.push(req.reqUser)
        await req.reqGroup.save()
        res.json({ status: "success", usergroup: usergroup })
    } catch (error) {
        handleError(error, res)
    }
}

export async function expel(req: Request, res: Response) {
    log_debug(`Expel`)
    try {
        if (!req.myUser.isAdmin)
            return errorResponse(res, HTTPSTATUS.FORBIDDEN, "Admin access required to expel a member")
        let result = await UserGroup.deleteMany({
            user: req.reqUser,
            group: req.reqGroup
        })
        req.reqGroup.members = req.reqGroup.members.filter((u: UserType) => u._id.toString() != req.reqUser._id.toString())
        await req.reqGroup.save()
        res.json({ status: "success", result: result })
    } catch (err) {
        handleError(err, res)
    }
}
