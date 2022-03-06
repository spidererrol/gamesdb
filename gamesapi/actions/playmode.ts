import { Request, Response } from 'express'
import { GameGroup, Games, PlayMode } from '../models/games'
import { Vote } from "../types/Vote"
import { handleError, log_debug, isKnown, errorResponse, getList } from '../libs/utils'
import { GameType } from "../schemas/Game"
import { OwnerType } from "../schemas/Owner"
import config from '../libs/config'
import '../libs/type-extensions'
import { HTTPSTATUS } from '../types/httpstatus'

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

export async function get(req: Request, res: Response) {
    try {
        getList("playmodes", PlayMode.find({ game: req.reqGame }), res)
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