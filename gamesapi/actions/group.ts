import { Request, Response } from 'express'
import { Group, PlayMode, PlayModeProgress, UserGroup } from '../models/games'
import { handleError, log_debug, isKnown, errorResponse, setGameGroupMode, isKnown_type, getList_Mapped, idString } from '../libs/utils'
import '../libs/type-extensions'
import { GroupType } from '../schemas/Group'
import { UserGroupType } from '../schemas/UserGroup'
import { HTTPSTATUS } from '../types/httpstatus'
import { UserType } from '../schemas/User'
import { GameType } from '../schemas/Game'
import { GameGroupMode } from '../types/GameGroupMode'
import { GameGroupType } from '../schemas/GameGroup'
import { recalcGroup } from './gamegroup'
import { getList_Paged } from '../libs/utils'
import { VoteType } from '../schemas/Vote'
import { Vote } from '../types/Vote'
import { PlayModeType } from '../schemas/PlayMode'
import { PlayModeProgressType } from '../schemas/PlayModeProgress'
import { PlayModeProgressValues } from '../types/PlayModeProgressValues'
let debug = require("debug")("actions/group")

// Helper functions:


// Actions:

export async function getAllPublic(req: Request, res: Response) {
    log_debug("Request all public groups")
    try {
        await getList_Paged("groups", Group.find({ private: false, }), res, req)
    } catch (err) {
        handleError(err, res)
    }
}

// export const getAllPrivate = TODO
export async function getAllPrivate(req: Request, res: Response) {
    log_debug("Request all (available) private groups")
    try {
        let ugs = UserGroup.find({
            user: req.myUser,
            private: true,
        })
        // .limit(config.PAGELIMIT + 1)
        // getRawList(ugs.map((ug: UserGroupType) => ug.group).filter((g: GroupType) => g.private), config.PAGELIMIT, res)
        await getList_Paged("groups", ugs, res, req)
    } catch (err) {
        handleError(err, res)
    }
}

export async function getGroupsForMe(req: Request, res: Response) {
    debug("getGroupsForMe")
    try {
        let groups = Group.find({
            $or: [
                { private: false },
                { "members._id": req.myUser._id.toString() }
            ]
        }).sort("name")
        await getList_Mapped("groups", groups, res,
            groups => {
                let out = []
                for (const group of groups) {
                    let outgroup: any = { ...group.toObject() }
                    outgroup.isMember = group.members.map((u: UserType) => u._id.toString()).includes(req.myUser._id.toString())
                    out.push(outgroup)
                }
                return out
            }
            , req)
    } catch (err) {
        handleError(err, res)
    }
}

export async function create(req: Request, res: Response) {
    try {
        log_debug("Create Group")
        if (!isKnown(req.body.name)) {
            res.status(406).json({ status: "error", message: "name is required" })
            return
        }
        let existing = await Group.findOne().find_conflict(req.body.name)
        // Don't use namish as that also matches partial description!
        if (isKnown(existing)) {
            res.status(409).json({ status: "error", message: "Group already exists", group: existing })
            return
        }
        let group = new Group(req.body)
        group.added = {
            when: new Date(),
            who: req.myUser,
        }
        group.members.push(req.myUser)
        let dbGroup = await group.save()
        if (isKnown_type<GroupType>(dbGroup) && isKnown(req.body.filters)) {
            recalcGroup(dbGroup)
        }
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
        if (isKnown_type<GroupType>(after) && isKnown(req.body.filters)) {
            recalcGroup(after)
        }
        res.json({ status: "success", result: result, before: req.reqGroup, after: after })
    } catch (error) {
        handleError(error, res)
    }
}

export async function recalc(req: Request, res: Response) {
    log_debug(`recalc group (${req.params.group})`)
    try {
        await recalcGroup(req.reqGroup, true)
        res.json({ status: "success" })
    } catch (error) {
        handleError(error, res)
    }
}

interface SortData {
    game: GameType,
    name: string,
    progressOrder?: number,
    gamevoteOrder?: number,
    playmodevoteOrder?: number,
}
interface SortDataComplete {
    game: GameType,
    name: string,
    progressOrder: number,
    gamevoteOrder: number,
    playmodevoteOrder: number,
}

function voteOrder(vote: VoteType) {
    switch (vote.vote_id) {
        case Vote.Desire:
            return 10
        case Vote.Accept:
            return 20
        case Vote.Dislike:
            return 40
        case Vote.Veto:
            return 50
        default:
            return 30
    }
}

function progressOrder(progress: PlayModeProgressValues): number {
    switch (progress) {
        case PlayModeProgressValues.Playing: return 10
        case PlayModeProgressValues.Paused: return 20
        case PlayModeProgressValues.Unplayed: return 40
        case PlayModeProgressValues.Finished: return 50
        case PlayModeProgressValues.Abandoned: return 60
        case PlayModeProgressValues.Uninterested: return 70
        default: return 30
    }
}

function votesOrder(votes: VoteType[], user: UserType): number {
    let best = 99
    for (const vote of votes) {
        if (idString(vote.user) === idString(user)) {
            let n = voteOrder(vote)
            if (n < best)
                best = n
        }
    }
    return best
}

function getGameVoteOrder(data: SortData, user: UserType): Promise<void> {
    let order = votesOrder(data.game.votes, user)
    data.gamevoteOrder = order
    return new Promise<void>((result) => result())
}

async function getPlayModeOrder(data: SortData, user: UserType, group: GroupType): Promise<void> {
    const playmodes: PlayModeType[] = await PlayMode.find({ game: data.game })


    let bestVote = 99
    let bestProgress = 99
    for (const playmode of playmodes) {
        let voten = votesOrder(playmode.votes, user)
        if (voten < bestVote)
            bestVote = voten
        let progress = await PlayModeProgress.findOne({ playmode: playmode, group })
        if (isKnown_type<PlayModeProgressType>(progress)) {
            let progn = progressOrder(progress.progress)
            if (progn < bestProgress)
                bestProgress = progn
        }
    }
    data.progressOrder = bestProgress
    data.playmodevoteOrder = bestVote
    return
}

async function game2sortdata(games: GameType[], user: UserType, group: GroupType): Promise<SortData[]> {
    const sortdata: SortData[] = []
    const promises: Promise<void>[] = []
    for (const game of games) {
        const data = { game: game, name: game.name } as SortData
        sortdata.push(data)
        promises.push(getGameVoteOrder(data, user))
        promises.push(getPlayModeOrder(data, user, group))
    }
    return Promise.all(promises).then(() => sortdata as SortData[])
}

function compSortData(a: SortDataComplete, b: SortDataComplete): number {
    return a.progressOrder - b.progressOrder
        || a.gamevoteOrder - b.gamevoteOrder
        || a.playmodevoteOrder - b.playmodevoteOrder
        || a.name.localeCompare(b.name)
}

function check(sd: SortData): SortDataComplete {
    if (sd.gamevoteOrder === undefined)
        throw new Error(sd.name + ":GVO")
    if (sd.playmodevoteOrder === undefined)
        throw new Error(sd.name + ":PMVO")
    if (sd.progressOrder === undefined)
        throw new Error(sd.name = ":PO")
    // console.warn(sd.name, sd.progressOrder, sd.gamevoteOrder, sd.playmodevoteOrder)
    return sd as SortDataComplete
}

async function sortGames(games: GameType[], group: GroupType, user: UserType): Promise<GameType[]> {
    return (await game2sortdata(games, user, group)).map(check).sort(compSortData).map(d => d.game)
}

export async function get(req: Request, res: Response) {
    log_debug(`Retrieve group (${req.params.group})`)
    try {
        const group: GroupType = { ...req.reqGroup.toObject() }
        group.games = await sortGames(group.games, group, req.myUser)
        res.json({ group })
    } catch (error) {
        handleError(error, res)
    }
}

export async function quickSearch(req: Request, res: Response) {
    let query: string = req.params.query
    log_debug(`Quick search for ${query}`)
    let q = Group.find().nameish(req.params.query, req.myUser)
    getList_Paged("groups", q, res)
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

export async function del(req: Request, res: Response) {
    log_debug("Delete group")
    try {
        let result = await Group.findByIdAndDelete(req.reqGroup._id)
        res.json({ status: "success", result: result })
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

export async function includeGame(req: Request, res: Response) {
    log_debug(`Add "${req.reqGame.name}" to "${req.reqGroup.name}"`)
    try {
        if (!req.reqGroup.isMember(req.myUser))
            return errorResponse(res, HTTPSTATUS.FORBIDDEN, "Only members may add a game")
        if (req.reqGroup.includesGame(req.reqGame))
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Game is already included")

        let gg: GameGroupType = await setGameGroupMode(req.reqGroup, req.reqGame, GameGroupMode.Include)
        recalcGroup(req.reqGroup)
        res.json({ status: "success", result: gg })
    } catch (error) {
        handleError(error, res)
    }
}

export async function excludeGame(req: Request, res: Response) {
    log_debug(`Exclude "${req.reqGame.name}" from "${req.reqGroup.name}"`)
    try {
        if (!req.reqGroup.isMember(req.myUser))
            return errorResponse(res, HTTPSTATUS.FORBIDDEN, "Only members may exclude a game")
        if (!req.reqGroup.includesGame(req.reqGame))
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Game is not included")

        let gg: GameGroupType = await setGameGroupMode(req.reqGroup, req.reqGame, GameGroupMode.Exclude)
        recalcGroup(req.reqGroup)
        res.json({ status: "success", result: gg })
    } catch (error) {
        handleError(error, res)
    }
}
