import { Request, Response } from 'express'
import { GameGroup, Games } from '../models/games'
import { Vote } from "../types/Vote"
import { handleError, log_debug, isKnown, errorResponse, bg, getList, setDateLike, idString, getList_Mapper } from '../libs/utils'
import { GameType } from "../schemas/Game"
import { OwnerType } from "../schemas/Owner"
import config from '../libs/config'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'
import { TODO } from './test'
import { UserType } from '../schemas/User'
import { fillGamePlayMode } from '../libs/fillGamePlayMode'
import { VoteType } from '../schemas/Vote'
import { recalcGame } from './gamegroup'

async function legacy_getList(query: any, res: Response, req: Request, mapper?: getList_Mapper): Promise<any> {
    return getList({
        listkey: "games",
        mapeach: g => fillGamePlayMode(g, req),
        mapper,
        query,
        res,
        req,
    })
    // const list = await query.limit(limit + 1)
    // const more: boolean = list.length > limit
    // const ret = { status: "success", games: list.slice(0, limit), more: more }
    // res?.json(ret)
    // return ret
}

function err404(res: Response) {
    res.status(404).json({ status: "error", message: "Game not found" })
}

// Actions:

export async function getAllGames(req: Request, res: Response) {
    // let myuser = req.myUser;
    log_debug("Request all games")
    try {
        legacy_getList(Games.find().sort({ "name": 1 }), res, req)
    } catch (err) {
        handleError(err, res)
    }
}

// export async function getByName(req: Request, res: Response) {
//     const name: string = req.params.name
//     log_debug(`Find game by name (${name})`)
//     try {
//         getList(
//             Games.find().where('name').regex(name),
//             config.PAGELIMIT,
//             res
//         )
//     } catch (err) {
//         handleError(err, res)
//     }
// }

export async function searchGame(req: Request, res: Response) {
    const search: any = req.body
    log_debug(`Request game by search`)
    log_debug(search)
    try {
        legacy_getList(Games.find(search).sort({ "name": 1 }), res, req)
    } catch (err) {
        handleError(err, res)
    }
};

export async function quickSearch(req: Request, res: Response) {
    let query: string = req.params.query
    log_debug(`Quick search for ${query}`)
    let q = Games.find().nameish(req.params.query).sort({ "name": 1 })
    legacy_getList(q, res, req)
}

export async function needVote(req: Request, res: Response) {
    log_debug("Find games which need voting on")
    let q = Games.find({
        "votes": { "$not": { "$elemMatch": { "user": req.myUser } } }
    })
    //FIXME: I kinda want this to also include where the is a playmode that hasn't been voted on.
    q.sort({ "name": 1 }) // This is effectively the fallback order for when there are the same number of votes
    legacy_getList(q, res, req,
        (list: GameType[]) => list.sort(
            (a, b) => b.votes.length - a.votes.length // Sort more votes first.
        )
    )
}

export async function addGame(req: Request, res: Response) {
    const gameData: GameType = req.body
    log_debug("Add new game")
    try {
        const setName = gameData.name
        const maxPlayers = gameData.maxPlayers
        const existing = await Games.findOne({ name: setName })
        if (isKnown(existing)) {
            res.status(400).json({
                status: "error",
                message: `Game "${setName}" already exists`,
                request: req.body,
                game: existing,
            })
            return
        }
        const byalias = await Games.findOne({ aliases: setName })
        if (isKnown(byalias)) {
            res.status(400).json({
                status: "error",
                message: `A game with an alias of "${setName}" already exists`,
                request: gameData,
                game: byalias,
            })
            return
        }
        const newgame = await Games.create({
            name: setName,
            maxPlayers: maxPlayers,
            added: { who: req.myUser },
        })
        await recalcGame(newgame)
        res.json({ status: "success", game: newgame })
    } catch (err) {
        handleError(err, res)
    }
}

export async function getVoteTypes(req: Request, res: Response) {
    log_debug("List valid vote types")
    let votes: any = {}
    for (const vote in Vote) {
        let votekey = vote as keyof typeof Vote
        if (typeof Vote[votekey] === 'number') {
            let voteno = Vote[votekey] as unknown as number
            votes[votekey] = voteno
        }
    }
    res.json({ votes: votes })
}

export async function addAlias(req: Request, res: Response) {
    const game_id: string = req.params.id,
        aliases: string[] = req.body
    log_debug('Append aliases')
    try {
        const game = await Games.findById(game_id)
        if (!isKnown(game)) {
            err404(res)
            return
        }
        log_debug(req.body)
        for (const addalias of aliases) {
            if (game.aliases.includes(addalias))
                continue
            if (game.name == addalias) {
                res.status(409).json({ status: "error", message: `Game is already called ${addalias}` })
                return
            }
            const othergame = await Games.findOne({ name: addalias })
            if (isKnown(othergame)) {
                res.status(409).json({ status: "error", message: `There is already a game called ${addalias}`, othergame: othergame })
                return
            }
            const byalias = await Games.findOne({ aliases: addalias })
            if (isKnown(byalias)) {
                res.status(409).json({ status: "error", message: `There is already a game with an alias of ${addalias}`, othergame: byalias })
                return
            }
            game.aliases.push(addalias)
        }
        let result = await game.save()
        res.json({ status: "success", game: game })
    } catch (err) {
        handleError(err, res)
    }
}

export async function deleteAlias(req: Request, res: Response) {
    const game_id: string = req.params.id, aliases: string[] = req.body
    log_debug('Delete aliases')
    try {
        const game = await Games.findById(game_id)
        if (!isKnown(game)) {
            err404(res)
            return
        }
        log_debug(req.body)
        game.aliases = game.aliases.filter((alias: string) => !aliases.includes(alias))
        let result = await game.save()
        res.json({ status: "success", game: game })
    } catch (err) {
        handleError(err, res)
    }
}

export async function addTag(req: Request, res: Response) {
    const game_id: string = req.params.id, tags: string[] = req.body
    log_debug('Append tags')
    try {
        const game = await Games.findById(game_id)
        if (!isKnown(game)) {
            err404(res)
            return
        }
        log_debug(req.body)
        for (const addtagu of tags) {
            let addtag = addtagu.toLocaleLowerCase()
            if (game.tags.includes(addtag))
                continue
            game.tags.push(addtag)
        }
        let result = await game.save()
        recalcGame(game)
        res.json({ status: "success", game: game })
    } catch (err) {
        handleError(err, res)
    }
}

export async function deleteTag(req: Request, res: Response) {
    const game_id: string = req.params.id
    // const tags: string[] = req.body
    log_debug('Delete tags')
    try {
        const game = await Games.findById(game_id)
        if (!isKnown(game)) {
            err404(res)
            return
        }
        log_debug(req.body)
        game.tags = game.tags.filter((tag: string) => !req.body.includes(tag))
        let result = await game.save()
        recalcGame(game)
        res.json({ status: "success", game: game })
    } catch (err) {
        handleError(err, res)
    }
}

export async function vote(req: Request, res: Response) {
    log_debug(`Voting for ${req.params.id}`)
    try {
        const game = await Games.findById(req.params.id).populate("votes")
        if (!isKnown(game)) {
            err404(res)
            return
        }
        let newvote: string | null = req.body.vote
        let myvote: any
        for (const vote of game.votes) {
            // log_debug(`Vote: ${vote.user._id} == ${req.myUser._id}`);
            if (vote.user._id.toString() == req.myUser._id.toString()) {
                // log_debug("Hit existing vote");
                myvote = vote
                break
            }
        }
        if (newvote === "None" || newvote === "Unknown" || newvote === null) {
            game.votes = game.votes.filter((v: VoteType) => v.user._id.toString() != req.myUser._id.toString())
        } else if (isKnown(myvote)) {
            myvote.vote = newvote//Vote[newvote as keyof typeof Vote];
            myvote.when = new Date()
            // myvote.user = req.myUser // Redundant
            // myvotes[0].save();
            // log_debug("Updated vote: " + myvote);
        } else {
            let vote = game.votes.push({
                user: idString(req.myUser),
                when: new Date(),
                vote: newvote,//Vote[newvote as keyof typeof Vote],
            })
            // log_debug("Added vote: " + vote);
            // vote.save();
        }
        let result = await game.save()
        // let newgame = await Games.findById(req.params.id).populate("votes");
        res.json({
            status: "success",
            game: game,
            result: result,
            //    after: newgame
        })
    } catch (err) {
        handleError(err, res)
    }
}

export async function getGame(req: Request, res: Response) {
    log_debug(`Request one game (${req.params.id})`)
    try {
        const game = await Games.findById(req.params.id)
        if (isKnown(game)) {
            res.json({ status: "success", game: fillGamePlayMode(game, req) })
        } else {
            err404(res)
        }
    } catch (err) {
        handleError(err, res)
    }
}

export async function updateGame(req: Request, res: Response) {
    log_debug(`Update game (${req.params.id})`)
    try {
        const game = await Games.findById(req.params.id)
        if (!isKnown(game)) {
            err404(res)
            return
        }
        delete req.body._id // I don't know what would happen if you updated this but I suspect it would be bad!
        let result = await game.updateOne({
            "$set": req.body
        })
        const after = await Games.findById(req.params.id)
        recalcGame(after)
        res.json({ status: "success", result: result, before: game, after: after })
    } catch (err) {
        handleError(err, res)
    }
}

export async function deleteGame(req: Request, res: Response) {
    log_debug(`Delete game (${req.params.id})`)
    try {
        const before = await Games.findById(req.params.id)
        if (!isKnown(before)) {
            err404(res)
            return
        }
        if (!req.myUser.isAdmin && req.myUser._id != before.added.who._id) {
            res.status(HTTPSTATUS.FORBIDDEN).json({
                status: "error",
                message: "You are not authorised to delete this Game",
            })
            return
        }
        const groups = await GameGroup.find({ game: before._id })
        if (groups.length > 0) {
            res.status(HTTPSTATUS.CONFLICT).json({ status: "error", message: "Game is in use" })
            return
        }
        const result = await Games.findByIdAndDelete(req.params.id)
        const after = await Games.findById(req.params.id)
        res.json({ status: "success", result: result, before: before, after: after })
    } catch (err) {
        handleError(err, res)
    }
}

export async function setOwnership(req: Request, res: Response) {
    log_debug(`Set ownership status of game ${req.params.id}`)
    try {
        const game = await Games.findById(req.params.id)
        const existing = game.owners.filter((owner: OwnerType) => owner.user._id.toString() == req.myUser._id.toString())
        if (existing.length > 0) {
            log_debug(`update existing game ownership`)
            // Already have an entry.
            // I only update for entries which exist, however they may be null:
            setDateLike((d) => existing[0].ownedSince = d, req.body["ownedSince"])
            setDateLike((d) => existing[0].installedSince = d, req.body["installedSince"])
            if (typeof req.body.maxPrice !== "undefined") existing[0].maxPrice = req.body.maxPrice
        } else {
            log_debug(`add new game ownership entry`)
            let existing: any[] = [{
                user: req.myUser._id
            }]
            setDateLike((d) => existing[0].ownedSince = d, req.body.ownedSince)
            setDateLike((d) => existing[0].installedSince = d, req.body.installedSince)
            if (typeof req.body.maxPrice !== "undefined") existing[0].maxPrice = req.body.maxPrice
            game.owners.push(existing[0])
            // game.owners.push({
            //     ownedSince: req.body.ownedSince,
            //     installedSince: req.body.installedSince,
            //     maxPrice: req.body.maxPrice,
            // });
        }
        const newgame = await game.save()
        res.json({ status: "success", game: newgame })
    } catch (err) {
        handleError(err, res)
    }
}

export async function addLink(req: Request, res: Response) {
    log_debug(`Add link to game (${req.reqGame._id})`)
    try {
        if (!isKnown(req.body.name)) {
            return errorResponse(res, HTTPSTATUS.BAD_REQUEST, "name is required")
        }
        if (!isKnown(req.body.href)) {
            return errorResponse(res, HTTPSTATUS.BAD_REQUEST, "href is required")
        }
        if (!isKnown(req.reqGame.links))
            req.reqGame.links = new Map<string, string>()
        if (isKnown(req.reqGame.links.get(req.body.name))) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Link name already exists")
        }
        // req.reqGame.links[req.body.name] = req.body.href
        // let result = await req.reqGame.save()
        // res.json({ status: "success", result: result, game: req.reqGame })
        let upd: any = {}
        upd[`links.${req.body.name}`] = req.body.href
        let result = await req.reqGame.updateOne({
            "$set": upd
        })
        let after = await Games.findById(req.reqGame._id)
        res.json({ status: "success", result: result, before: req.reqGame, after: after })
    } catch (err) {
        handleError(err, res)
    }
}

export async function delLink(req: Request, res: Response) {
    log_debug(`Delete link ${req.body.name} from game (${req.reqGame._id})`)
    try {
        if (!isKnown(req.body.name)) {
            return errorResponse(res, HTTPSTATUS.BAD_REQUEST, "name is required")
        }
        if (!isKnown(req.reqGame.links.get(req.body.name))) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Link name doesn't exists")
        }
        req.reqGame.links.delete(req.body.name)
        let result = await req.reqGame.save()
        res.json({ status: "success", result: result, game: req.reqGame })
    } catch (err) {
        handleError(err, res)
    }
}

export async function editLink(req: Request, res: Response) {
    log_debug(`Update link on game (${req.reqGame._id})`)
    try {
        if (!isKnown(req.body.name)) {
            return errorResponse(res, HTTPSTATUS.BAD_REQUEST, "name is required")
        }
        if (!isKnown(req.body.href)) {
            return errorResponse(res, HTTPSTATUS.BAD_REQUEST, "href is required")
        }
        if (!isKnown(req.reqGame.links))
            req.reqGame.links = new Map<string, string>()
        if (!isKnown(req.reqGame.links.get(req.body.name))) {
            return errorResponse(res, HTTPSTATUS.CONFLICT, "Link name doesn't exists")
        }
        req.reqGame.links.set(req.body.name, req.body.href)
        let result = await req.reqGame.save()
        res.json({ status: "success", result: result, game: req.reqGame })
    } catch (err) {
        handleError(err, res)
    }
}

export { TODO }