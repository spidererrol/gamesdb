import { Request, Response } from 'express'
import { PlayModeProgress } from '../models/games'
import { handleError, isKnown, errorResponse, isKnown_type } from '../libs/utils'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'
import { PlayModeProgressValues } from '../types/PlayModeProgressValues'
import { PlayModeProgressType } from '../schemas/PlayModeProgress'
import { VoteType } from '../schemas/Vote'
import { OwnerType } from '../schemas/Owner'
import { Owned } from '../types/Owned'

// Helper functions:

// Actions:

function setOwned(ownstate: OwnerType, newstate: Owned): void {
    switch (newstate) {
        case Owned.Installed:
            ownstate.isOwned = true
            ownstate.isInstalled = true
            break
        case Owned.Owned:
            ownstate.isOwned = true
            ownstate.isInstalled = false
            break
        case Owned.Unowned:
            ownstate.isOwned = false
            ownstate.isInstalled = false
            break
    }
}

export async function setProgress(req: Request, res: Response) {
    try {
        let pmp: PlayModeProgressType | null = req.reqPlayModeProgress
        if (!isKnown(pmp))
            pmp = await PlayModeProgress.findOne({
                playmode: req.reqPlayMode,
                group: req.reqGroup
            })
        if (!isKnown(pmp))
            pmp = await PlayModeProgress.create({
                playmode: req.reqPlayMode,
                group: req.reqGroup
            })
        if (isKnown_type<PlayModeProgressType>(pmp)) {
            if (isKnown(req.body.progress))
                pmp.progress = PlayModeProgressValues[req.body.progress as keyof typeof PlayModeProgressValues]
            let updatepm = false
            if (isKnown(req.body.vote)) {
                let vote: string = req.body.vote as string
                let myvotes = pmp.playmode.votes.filter(v => v.user == req.myUser)
                let myvote: VoteType
                if (myvotes.length > 0) {
                    myvote = myvotes[0]
                    myvote.vote = vote
                } else {
                    pmp.playmode.votes.push({
                        user: req.myUser,
                        vote: vote,
                    } as unknown as VoteType)
                }
                updatepm = true
            }
            if (isKnown(req.body.owned)) {
                let newowned = req.body.owned as string
                let myowned = pmp.playmode.owners.filter(v => v.user == req.myUser)
                let myown: OwnerType
                if (myowned.length > 0) {
                    myown = myowned[0]
                    setOwned(myown, Owned[newowned as keyof typeof Owned])
                } else {
                    myown = {
                        user: req.myUser,
                        isOwned: false, isInstalled: false
                    } as unknown as OwnerType
                    setOwned(myown, Owned[newowned as keyof typeof Owned])
                    pmp.playmode.owners.push(myown)
                }
                updatepm = true
            }
            let pmresult = await pmp.playmode.save()
            let result = await pmp.save()
            res.json({ status: "success", progress: pmp, result: result })
        } else {
            errorResponse(res, HTTPSTATUS.INTERNAL_ERROR, "Cannot create progress object")
        }
    } catch (error) {
        handleError(error, res)
    }
}

export async function getProgress(req: Request, res: Response) {
    try {
        let pmp: PlayModeProgressType | null = req.reqPlayModeProgress
        if (!isKnown(pmp))
            pmp = await PlayModeProgress.findOne({
                playmode: req.reqPlayMode,
                group: req.reqGroup
            })
        if (!isKnown(pmp))
            pmp = await PlayModeProgress.create({
                playmode: req.reqPlayMode,
                group: req.reqGroup
            })
        if (isKnown_type<PlayModeProgressType>(pmp)) {
            let outpmp: any = { ...(pmp as any).toObject() }
            outpmp.voteState = await (pmp as any).voteState()
            outpmp.ownedState = await (pmp as any).ownedState()
            res.json({ status: "success", progress: outpmp })
        } else {
            errorResponse(res, HTTPSTATUS.INTERNAL_ERROR, "Cannot create progress object")
        }
    } catch (error) {
        handleError(error, res)
    }
}

// export async function add(req: Request, res: Response) {
//     try {
//         let name = req.body.name
//         let existing = await PlayMode.findOne({ name: name, game: req.reqGame })
//         if (isKnown(existing)) {
//             return errorResponse(res, HTTPSTATUS.CONFLICT, `PlayMode already exists for ${req.reqGame.name}`)
//         }
//         let playmode = await PlayMode.create({
//             game: req.reqGame,
//             ...req.body
//         })
//         res.json({
//             status: "success",
//             playmode: playmode
//         })
//     }
//     catch (err) {
//         handleError(err, res)
//     }
// }

// export async function get(req: Request, res: Response) {
//     try {
//         getList("playmodes", PlayMode.find({ game: req.reqGame }), res)
//     } catch (error) {
//         handleError(error, res)
//     }
// }

// export async function update(req: Request, res: Response) {
//     log_debug(`Update playmode`)
//     try {
//         if (!isKnown(req.reqPlayMode)) {
//             errorResponse(res, HTTPSTATUS.NOT_FOUND, "Playmode not found")
//             return
//         }
//         delete req.body._id // I don't know what would happen if you updated this but I suspect it would be bad!
//         let result = await req.reqPlayMode.updateOne({
//             "$set": req.body
//         })
//         const after = await PlayMode.findById(req.params.playmode)
//         res.json({ status: "success", result: result, before: req.reqPlayMode, after: after })
//     } catch (err) {
//         handleError(err, res)
//     }

// }
