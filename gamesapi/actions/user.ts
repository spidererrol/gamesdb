import { Request, Response } from 'express'
import { UserGroup, Users } from '../models/games'
import '../libs/type-extensions'
import { UserGroupType } from '../schemas/UserGroup'
import { getList_Paged, log_debug } from '../libs/utils'
import config from '../libs/config'

// Helper functions:

async function getList(query: any, limit: number = config.PAGELIMIT, res?: Response): Promise<any> {
    const list = await query.limit(limit + 1)
    return getRawList(list, limit, res)
}

function getRawList(list: any, limit: number, res?: Response) {
    const more: boolean = list.length > limit
    const ret = { status: "success", users: list.slice(0, limit), more: more }
    res?.json(ret)
    return ret
}


// Actions:

export async function memberships(req: Request, res: Response) {
    let ugs = await UserGroup.find({ user: req.myUser })
    res.json({
        status: "success",
        memberships: ugs.map((ug: UserGroupType) => ug.group).sort((a, b) => a.name.localeCompare(b.name))
    })
}

export async function quickSearch(req: Request, res: Response) {
    let query: string = req.params.query
    log_debug(`Quick search for ${query}`)
    let q = Users.find().nameish(req.params.query)
    getList(q, config.PAGELIMIT, res)
}

export async function get(req: Request, res: Response) {
    res.json({
        status: "success",
        user: req.myUser,
    })
}

export async function getAll(req: Request, res: Response) {
    let user = Users.find().sort("name")
    await getList_Paged("users", user, res, req)
}