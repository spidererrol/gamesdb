import { Request, Response } from 'express'
import { PlayMode } from '../models/games'
import { handleError, log_debug, isKnown, errorResponse, getList_deprecated, getList, err404, setDateLike } from '../libs/utils'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'
import { fillGamePlayMode } from '../libs/fillGamePlayMode'
import { OwnerType } from '../schemas/Owner'

// Helper functions:

// Actions:

export async function add(req: Request, res: Response) {
    try {
        let name = req.body.name
        let existing = await PlayMode.findOne({ name: name, game: req.reqGame })
        if (isKnown(existing)) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, `PlayMode already exists for ${req.reqGame.name}`)
        }
        let playmode = await PlayMode.create({
            game: req.reqGame,
            ...req.body
        })
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
        if (!isKnown(req.reqPlayMode)) {
            errorResponse(res, HTTPSTATUS.NOT_FOUND, "Playmode not found")
            return
        }
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

export async function vote(req: Request, res: Response) {
    log_debug(`Voting playmode`)
    try {
        const playmode = req.reqPlayMode //await Games.findById(req.params.id).populate("votes")
        if (!isKnown(playmode)) {
            err404(res, "playmode")
            return
        }
        let newvote: string = req.body.vote
        let myvote: any
        for (const vote of playmode.votes) {
            // log_debug(`Vote: ${vote.user._id} == ${req.myUser._id}`);
            if (vote.user._id.toString() == req.myUser._id.toString()) {
                // log_debug("Hit existing vote");
                myvote = vote
                break
            }
        }
        if (isKnown(myvote)) {
            myvote.vote = newvote//Vote[newvote as keyof typeof Vote];
            myvote.when = new Date()
            // myvotes[0].save();
            // log_debug("Updated vote: " + myvote);
        } else {
            let vote = playmode.votes.push({
                user: req.myUser._id,//FIXME: I can't figure out how to get user to save!
                when: new Date(),
                vote: newvote,//Vote[newvote as keyof typeof Vote],
            } as any)
            // log_debug("Added vote: " + vote);
            // vote.save();
        }
        let result = playmode.save()
        // let newgame = await Games.findById(req.params.id).populate("votes");
        res.json({
            status: "success",
            playmode: fillGamePlayMode(playmode, req),
            result: result,
            //    after: newgame
        })
    } catch (err) {
        handleError(err, res)
    }
}

export async function setOwnership(req: Request, res: Response) {
    log_debug(`Set ownership status of playmode ${req.reqPlayMode._id.toString()}`)
    try {
        const playmode = req.reqPlayMode //await Games.findById(req.params.id)
        const existing = playmode.owners.filter((owner: OwnerType) => owner.user._id.toString() == req.myUser._id.toString())
        if (existing.length > 0) {
            log_debug(`update existing`)
            // Already have an entry.
            // I only update for entries which exist, however they may be null:
            setDateLike((d) => existing[0].ownedSince = d, req.body["ownedSince"])
            setDateLike((d) => existing[0].installedSince = d, req.body["installedSince"])
            if (typeof req.body.maxPrice !== "undefined") existing[0].maxPrice = req.body.maxPrice
        } else {
            log_debug(`add new entry`)
            let existing: any[] = [{
                user: req.myUser._id
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
