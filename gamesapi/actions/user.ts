import { Request, Response } from 'express'
import { UserGroup } from '../models/games'
import '../libs/type-extensions'
import { UserGroupType } from '../schemas/UserGroup'

// Helper functions:

// Actions:

export async function memberships(req: Request, res: Response) {
    let ugs = await UserGroup.find({ user: req.myUser })
    res.json({
        status: "success",
        memberships: ugs.map((ug: UserGroupType) => ug.group)
    })
}
