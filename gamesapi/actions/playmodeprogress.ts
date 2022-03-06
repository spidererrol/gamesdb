import { Request, Response } from 'express'
import { PlayMode, PlayModeProgress } from '../models/games'
import { handleError, log_debug, isKnown, errorResponse, getList, isKnown_type } from '../libs/utils'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'
import { PlayModeProgressValues } from '../types/PlayModeProgressValues'
import { PlayModeProgressType } from '../schemas/PlayModeProgress'

// Helper functions:

// Actions:

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
            pmp.progress = PlayModeProgressValues[req.body.progress as keyof typeof PlayModeProgressValues]
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
            res.json({ status: "success", progress: pmp })
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
