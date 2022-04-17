import { Request, Response } from 'express'
import { GameGroup, PlayMode, PlayModeProgress } from '../models/games'
import { handleError, log_debug, isKnown, errorResponse, getList_deprecated, getList, err404, setDateLike, idString } from '../libs/utils'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'
import { fillGamePlayMode } from '../libs/fillGamePlayMode'
import { OwnerType } from '../schemas/Owner'
import { GameGroupType } from '../schemas/GameGroup'
import { PlayModeProgressType } from '../schemas/PlayModeProgress'
import { GameType } from '../schemas/Game'
import { UserType } from '../schemas/User'
import { PlayModeType } from '../schemas/PlayMode'

// Helper functions:

// Actions:

export async function add(req: Request, res: Response) {
    try {
        log_debug("Add Playmode")
        let name = req.body.name
        let existing = await PlayMode.findOne({ name: name, game: req.reqGame })
        if (isKnown(existing)) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, `PlayMode already exists for ${req.reqGame.name}`)
        }
        let playmode = await PlayMode.create({
            game: req.reqGame,
            ...req.body
        })
        req.reqGame.voted = [] // Delete all voted because noone could have voted yet!
        await req.reqGame.save()
        res.json({
            status: "success",
            playmode: playmode
        })
    }
    catch (err) {
        handleError(err, res)
    }
}

export async function getAll(req: Request, res: Response) {
    try {
        // getList_deprecated("playmodes", PlayMode.find({ game: req.reqGame }), res)
        getList({
            listkey: "playmodes",
            query: PlayMode.find({ game: req.reqGame }),
            mapeach: pm => fillGamePlayMode(pm, req),
            res: res,
            req: req,
        })
    } catch (error) {
        handleError(error, res)
    }
}

export async function update(req: Request, res: Response) {
    log_debug(`Update playmode`)
    try {
        // Unneeded, already handled with parameter handler:
        // if (!isKnown(req.reqPlayMode)) {
        //     errorResponse(res, HTTPSTATUS.NOT_FOUND, "Playmode not found")
        //     return
        // }
        console.log("🚀 ~ file: playmode.ts ~ line 56 ~ update ~ req.reqPlayMode", req.reqPlayMode)
        delete req.body._id // I don't know what would happen if you updated this but I suspect it would be bad!
        let result = await req.reqPlayMode.updateOne({
            "$set": req.body
        })
        const after = await PlayMode.findById(req.params.playmode)
        res.json({ status: "success", result: result, before: req.reqPlayMode, after: after })
    } catch (err) {
        handleError(err, res)
    }
}

export async function deletePlaymode(req: Request, res: Response) {
    log_debug(`Delete playmode (${req.reqPlayMode._id})`)
    try {
        // if (!req.myUser.isAdmin && req.myUser._id != req.reqPlayMode.added.who._id) { // reqPlayMode doesn't have an "added" and I don't want to restrict to just admins.
        if (req.reqPlayMode.game._id.toString() !== req.reqGame._id.toString()) {
            res.status(HTTPSTATUS.FORBIDDEN).json({
                status: "error",
                message: "You are not authorised to delete this Playmode",
            })
            return
        }

        const blockingpmps = await PlayModeProgress.find({
            playmode: req.reqPlayMode._id,
            $or: [
                { progress: "Playing" },
                { progress: "Paused" }
            ]
        }).count()
        if (blockingpmps > 0) {
            res.status(HTTPSTATUS.CONFLICT).json({ status: "error", message: "Playmode is in use by " + blockingpmps + " groups" })
            return
        }

        const pmps: PlayModeProgressType[] = await PlayModeProgress.find({ playmode: req.reqPlayMode._id })

        for (const pmp of pmps) {
            const gamegroups: GameGroupType[] = await GameGroup.find({ playmodes: pmp._id.toString() })
            for (const gamegroup of gamegroups) {
                gamegroup.playmodes = gamegroup.playmodes.filter(p => p._id.toString() == pmp._id.toString())
                await gamegroup.save()
            }
        }
        await PlayModeProgress.deleteMany({ playmode: req.reqPlayMode._id })
        const result = await PlayMode.findByIdAndDelete(req.reqPlayMode._id)
        // const after = await Games.findById(req.params.id)
        res.json({ status: "success", result: result })
    } catch (err) {
        handleError(err, res)
    }
}

export async function get(req: Request, res: Response) {
    log_debug(`Get playmode`)
    try {
        if (!isKnown(req.reqPlayMode)) {
            errorResponse(res, HTTPSTATUS.NOT_FOUND, "Playmode not found")
            return
        }
        res.json({ status: "success", playmode: fillGamePlayMode(req.reqPlayMode, req) })
    } catch (err) {
        handleError(err, res)
    }

}

async function update_voted(game: GameType, user: UserType): Promise<void> {
    const userid = idString(user)
    const playmodes: PlayModeType[] = await PlayMode.find({ game })
    let unvoted = false
    for (const pm of playmodes) {
        if (pm.votes.filter(v => idString(v.user) == userid).length == 0) {
            unvoted = true
            break
        }
    }
    let isunvoted = game.voted.filter(u => idString(u) == userid).length == 0
    if (unvoted == isunvoted)
        return
    if (unvoted) {
        // Need to remove voted
        game.voted = game.voted.filter(v => idString(v) != userid)
    } else {
        // Need to add voted
        game.voted.push(user)
    }
    await game.save()
    return
}

async function process_vote(req: Request, res: Response) {
    const playmode = req.reqPlayMode
    // if (!isKnown(playmode)) { // This should never happen as params handler should have dealt with it.
    //     err404(res, "playmode")
    //     return
    // }
    let newvote: string | null = req.body.vote
    let myvote: any
    for (const vote of playmode.votes) {
        // log_debug(`Vote: ${vote.user._id} == ${req.myUser._id}`);
        if (idString(vote.user) == idString(req.myUser)) {
            // log_debug("Hit existing vote");
            myvote = vote
            break
        }
    }
    if (newvote === null || newvote === "Unknown" || newvote === "None") {
        // No vote
        if (isKnown(myvote)) {
            // Delete old vote
            playmode.votes = playmode.votes.filter(v => idString(v) !== idString(myvote))
            let result = await playmode.save()
            await update_voted(req.reqGame ?? playmode.game, req.myUser)
            return [result, playmode]
        }
        return [{ nochange: true }, playmode]
    }
    if (isKnown(myvote)) {
        myvote.vote = newvote//Vote[newvote as keyof typeof Vote];
        myvote.when = new Date()
        // myvotes[0].save();
        // log_debug("Updated vote: " + myvote);
    } else {
        let vote = playmode.votes.push({
            user: idString(req.myUser),
            when: new Date(),
            vote: newvote,//Vote[newvote as keyof typeof Vote],
        } as any)
        // log_debug("Added vote: " + vote);
        // vote.save();
    }
    let result = await playmode.save()
    await update_voted(req.reqGame ?? playmode.game, req.myUser)
    return [result, playmode]
}

export async function vote(req: Request, res: Response) {
    log_debug(`Voting playmode`)
    try {
        Error.stackTraceLimit = 100
        let [result, playmode] = await process_vote(req, res)
        res.json({
            status: "success",
            playmode: fillGamePlayMode(playmode, req),
            result: result,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export async function setOwnership(req: Request, res: Response) {
    log_debug(`Set ownership status of playmode ${req.reqPlayMode._id.toString()}`)
    try {
        const playmode = req.reqPlayMode //await Games.findById(req.params.id)
        const existing = playmode.owners.filter((owner: OwnerType) => idString(owner.user) == idString(req.myUser))
        if (existing.length > 0) {
            log_debug(`update existing playmode ownership`)
            // Already have an entry.
            // I only update for entries which exist, however they may be null:
            setDateLike((d) => existing[0].ownedSince = d, req.body["ownedSince"])
            setDateLike((d) => existing[0].installedSince = d, req.body["installedSince"])
            if (typeof req.body.maxPrice !== "undefined") existing[0].maxPrice = req.body.maxPrice
        } else {
            log_debug(`add new playmode ownership entry`)
            let existing: any[] = [{
                user: req.myUser
            }]
            setDateLike((d) => existing[0].ownedSince = d, req.body.ownedSince)
            setDateLike((d) => existing[0].installedSince = d, req.body.installedSince)
            if (typeof req.body.maxPrice !== "undefined") existing[0].maxPrice = req.body.maxPrice
            playmode.owners.push(existing[0])
            // game.owners.push({
            //     ownedSince: req.body.ownedSince,
            //     installedSince: req.body.installedSince,
            //     maxPrice: req.body.maxPrice,
            // });
        }
        const newgame = await playmode.save()
        res.json({ status: "success", game: newgame })
    } catch (err) {
        handleError(err, res)
    }
}
