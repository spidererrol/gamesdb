import { Request, Response } from 'express'
import { Group, UserGroup } from '../models/games'
import { handleError, log_debug, isKnown } from '../libs/utils'
import '../libs/type-extensions'
import { GroupType } from '../schemas/Group'
import config from '../libs/config'
import { UserGroupType } from '../schemas/UserGroup'
import { HTTPSTATUS } from '../types/httpstatus'

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
    log_debug("Request all (available) public groups")
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
            //FIXME: Don't hand out non-member private group?
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
        let result = await req.myGroup.updateOne({
            "$set": req.body
        })
        const after = await Group.findById(req.params.group)
        res.json({ status: "success", result: result, before: req.myGroup, after: after })
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
        if (req.myGroup.private) {
            res.status(HTTPSTATUS.FORBIDDEN).json({ status: "error", message: "Group is private" })
            return
        }
        let usergroup: UserGroupType
        let ugs = await UserGroup.find({
            user: req.myUser,
            group: req.myGroup
        })
        if (ugs.length > 0) {
            log_debug("Already in group")
            res.status(HTTPSTATUS.CONFLICT).json({ status: "error", message: "Already a member" })
            return
        } else {
            usergroup = await UserGroup.create({
                user: req.myUser,
                group: req.myGroup
            })
            req.myGroup.members.push(req.myUser)
        }
        await req.myGroup.save()
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
            group: req.myGroup
        })
        if (!isKnown(ug)) {
            res.status(HTTPSTATUS.NOT_FOUND).json({ status: "error", message: "Not a member", ug: ug })
            return
        }
        await UserGroup.findByIdAndDelete(ug._id)
        req.myGroup.members = req.myGroup.members.filter((u) => u._id.toString() != req.myUser._id.toString())
        await req.myGroup.save()
        if (req.myGroup.private && req.myGroup.members.length == 0) {
            await Group.findByIdAndDelete(req.myGroup._id)
            res.json({ status: "success", message: "Group removed" })
            return
        }
        res.json({ status: "success", message: "Group left" })
    } catch (error) {
        handleError(error, res)
    }
}
