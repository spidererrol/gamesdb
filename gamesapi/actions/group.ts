import { Request, Response } from 'express'
import { Group, UserGroup } from '../models/games'
import { handleError, log_debug, isKnown } from '../libs/utils'
import '../libs/type-extensions'
import { GroupType } from '../schemas/Group'
import config from '../libs/config'
import { UserGroupType } from '../schemas/UserGroup'

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
        let existing = await Group.findOne({ name: req.body.name })
        if (isKnown(existing)) {
            res.status(409).json({ status: "error", message: "Group already exists", group: existing })
            return
        }
        let group = new Group(req.body)
        let dbGroup = await group.save()
        let join = new UserGroup({
            user: req.myUser,
            group: dbGroup
        })
        let dbJoin = await join.save()
        //FIXME: _ids in UserGroup seeming to be mangled?
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
