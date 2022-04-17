import express, { Router } from 'express'
import { createHmac, randomBytes } from 'crypto'
import config from './config'
import { Games, Users, Group, GameGroup, PlayMode, PlayModeProgress } from '../models/games'
import { HTTPSTATUS } from '../types/httpstatus'
import './type-extensions'
import { RangeFilterType } from "../schemas/RangeFilter"
import { GroupType } from '../schemas/Group'
import { GameType } from '../schemas/Game'
import { GameGroupMode } from '../types/GameGroupMode'
import { GameGroupType } from '../schemas/GameGroup'

// ### FUNCTIONS ###

export function err404(res: express.Response, thingtype: string) {
    res.status(404).json({ status: "error", message: `${thingtype} not found` })
}

export function log_debug(msg: any) {
    console.log(msg)
}

export function runNext(next: unknown) {
    (next as express.NextFunction)()
}

export function useShim(inNext: (req: express.Request, res: express.Response, next: express.NextFunction) => void): (req: any, res: any, next: any) => void {
    return (inNext as (req: any, res: any, next: any) => void)
}

type actionFunc = (req: express.Request, res: express.Response) => void

export function reqShim(inNext: actionFunc): (a: any, b: any) => void {
    return (inNext as (a: any, b: any) => void)
}

function filterStack(stack: string = "(none)"): string {
    return stack.replace(/[^\n]*\/node_modules\/[^\n]*/g, "...").replace(/(?:\.\.\.\n)*\.\.\.\n/g, "...\n")
}

export function handleError(err: any, res: express.Response): void {
    if (err instanceof Error) {
        if (config.DEBUG) {
            console.log("Sent Error (with stack): " + err.message)
            console.dir(filterStack(err.stack), { colors: true })
            res.status(500).json({ status: "error", message: err.message, stack: err.stack })
        } else {
            console.log("Sent Error: " + err.message)
            res.status(500).json({ status: "error", message: err.message })
        }
    } else {
        console.log("Sent Unknown Error (not Error object)")
        res.status(500).json({ status: "error", message: "Unknown Error" })
    }
    if (Error.captureStackTrace) {
        let st: any = {}
        Error.captureStackTrace(st)
        console.log("Local stack trace:")
        console.dir(filterStack(st.stack), { colors: true })
    } else {
        console.log("No captureStackTrace")
    }
    return
}

export function isKnown(value?: any | null): value is any {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function isKnown_type<T>(value?: T | null): value is T {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function badAuth(res: express.Response) {
    res.status(400).json({ message: "Please log in." })
}

type methods = "get" | "post" | "patch" | "delete"
type methodSet = methods[]
type multimethods = methods | methodSet

function IsMethodSet(value: any): value is methodSet {
    if (typeof value === 'undefined') return false
    if ((value as methodSet).includes) {
        return true
    }
    return false
}

export function bindRouterPath(router: Router, method: multimethods, path: string, func: actionFunc) {
    let methods: methodSet
    if (IsMethodSet(method)) {
        methods = method
    } else {
        methods = [method]
    }
    if (methods.includes("get"))
        router.get(path, reqShim(func))
    if (methods.includes("post"))
        router.post(path, reqShim(func))
    if (methods.includes("patch"))
        router.patch(path, reqShim(func))
    if (methods.includes("delete"))
        router.delete(path, reqShim(func))
}

export function setupParams(app: express.Router) {
    app.param("game", async (req, res, next, game_id) => {
        try {
            let game = await Games.findById(game_id)
            if (!isKnown(game)) {
                res.status(404).json({ status: "error", message: "No such game" })
                return
            }
            (req as express.Request).reqGame = game
        } catch (e) {
            handleError(e, res)
        }
        next()
    })
    app.param("user", async (req, res, next, user_id) => {
        try {
            let user = await Users.findById(user_id)
            if (!isKnown(user)) {
                res.status(404).json({ status: "error", message: "No such user" })
                return
            }
            (req as express.Request).reqUser = user
        } catch (e) {
            handleError(e, res)
        }
        next()
    })
    app.param("group", async (req, res, next, group_id) => {
        try {
            let group = await Group.findById(group_id)
            if (!isKnown(group)) {
                res.status(404).json({ status: "error", message: "No such group: " + group_id })
                return
            }
            (req as express.Request).reqGroup = group
        } catch (e) {
            handleError(e, res)
        }
        next()
    })
    app.param("playmode", async (req, res, next, playmode_id) => {
        try {
            let playmode = await PlayMode.findById(playmode_id)
            if (!isKnown(playmode)) {
                return errorResponse(res, HTTPSTATUS.NOT_FOUND, "No such playmode")
            }
            (req as express.Request).reqPlayMode = playmode
        } catch (e) {
            handleError(e, res)
        }
        next()
    })
    app.param("progress", async (req, res, next, progress_id) => {
        try {
            let progress = await PlayModeProgress.findById(progress_id)
            if (!isKnown(progress)) {
                return errorResponse(res, HTTPSTATUS.NOT_FOUND, "No such progress")
            }
            (req as express.Request).reqPlayModeProgress = progress
        } catch (e) {
            handleError(e, res)
        }
        next()
    })

}

export function errorResponse(res: express.Response, code: HTTPSTATUS, message: string, more?: any): void {
    let ret = { ...more }
    ret.status = "error"
    ret.message = message
    res.status(code).json(ret)
    return
}

/**
 * Old method of returning a list of items in a standard way
 * 
 * @deprecated Use getList instead
 * @param listkey key name to store the resulting list under
 * @param query query to process
 * @param res response object
 * @param limit default:config.PAGELIMIT max number of items to return
 * @returns the object that has been sent out.
 */
export async function getList_deprecated(listkey: string, query: any, res: express.Response, limit: number = config.PAGELIMIT): Promise<any> {
    const list = await query.limit(limit + 1)
    const more: boolean = list.length > limit
    const ret: any = { status: "success", more: more }
    ret[listkey] = list.slice(0, limit)
    res.json(ret)
    return ret
}

export type getList_Mapper = (inlist: any[]) => any[]
export type getList_MapOne = (item: any) => any

interface getList_Args {
    listkey: string
    query: any
    res: express.Response
    mapper?: getList_Mapper | null
    mapeach?: getList_MapOne | null
    req?: express.Request
    pageno?: number
    limit?: number
}

/**
 * Takes a query and sends a json result to res
 * @param listkey key name to use in json to store the results
 * @param query mongoose query to provide the results
 * @param res Response object
 * @param req (optional) Request object - recommended
 * @param pageno (optional) Page number to send (use req instead)
 * @param limit (optional) Page size (use req instead)
 * @param mapeach (optional) Convert each item
 * @param mapper (optional) Convert entire results list
 * @returns 
 */
export async function getList({ listkey, query, res, mapper, mapeach, req, pageno = -1, limit = -1 }: getList_Args): Promise<void> {
    if (pageno < 0) {
        if (isKnown_type<express.Request>(req)) {
            if ('page' in req.query) {
                pageno = +(req.query.page as string)
            } else {
                pageno = 0
            }
        } else {
            pageno = 0
        }
    }
    if (limit < 0) {
        if (isKnown_type<express.Request>(req)) {
            if ('limit' in req.query) {
                limit = +(req.query.limit as string)
            } else {
                limit = config.PAGELIMIT
            }
        } else {
            limit = config.PAGELIMIT
        }
    }
    // log_debug(`>Page:${pageno}, Limit:${limit}`)
    const resultcount = query.count
    let list = await query.skip(pageno * limit).limit(limit + 1)
    const more: boolean = list.length > limit
    const ret: any = { status: "success", more: more, count: resultcount }
    if (isKnown(mapeach)) {
        list = list.map(mapeach)
    }
    if (isKnown_type<getList_Mapper>(mapper)) {
        ret[listkey] = mapper(list.slice(0, limit))
    } else {
        ret[listkey] = list.slice(0, limit)
    }
    // log_debug(ret)
    res.json(ret)
    return
}

export async function getList_Paged(listkey: string, query: any, res: express.Response, req?: express.Request, pageno: number = -1, limit: number = -1): Promise<void> {
    return getList({ listkey, query, res, req, pageno, limit })
}

export async function getList_Mapped(listkey: string, query: any, res: express.Response, mapper: getList_Mapper, req?: express.Request, pageno: number = -1, limit: number = -1): Promise<void> {
    return getList({ listkey, query, res, req, pageno, limit, mapper })
}

export async function bg(then: Promise<any>): Promise<void> {
    await then
    return
}

// ### Password utilities ###

export namespace pw {
    export function crypt(username: string, secret: string, crypt?: string): string {
        let sSalt: string
        let sHash: string = "sha512"
        let sDigest: string
        let bSalt: Buffer
        if (crypt !== undefined) {
            let parts = crypt.split('$', 3)
            sHash = parts[0]
            sSalt = parts[1]
            sDigest = parts[2]
            bSalt = Buffer.from(sSalt, 'base64')
        } else {
            bSalt = randomBytes(16)
            sSalt = bSalt.toString('base64')
        }
        let hmac = createHmac(sHash, bSalt)
        hmac.update(`${username}:${secret}`)
        let newDigest = hmac.digest("base64")
        return [sHash, sSalt, newDigest].join('$')
    }
    export function check(username: string, secret: string, saved_crypt: string): boolean {
        return crypt(username, secret, saved_crypt) == saved_crypt
    }
}

export function inRange(inRange?: RangeFilterType, against?: number): boolean {
    if (!isKnown(against))
        return true
    if (!isKnown(inRange))
        return true
    let range: RangeFilterType = inRange as RangeFilterType
    if (isKnown_type<number>(range.above) && isKnown_type<number>(against) && range.above > against)
        return false
    if (isKnown_type<number>(range.below) && isKnown_type<number>(against) && range.below > against)
        return false
    return true
}

export function intersect(arra: string[], arrb: string[]): boolean {
    for (const a of arra) {
        for (const b of arrb) {
            if (a == b)
                return true
        }
    }
    return false
}

enum Match {
    Unknown,
    Hit,
    Miss
}

function testTags(filter?: string[], tags?: string[]): Match {
    if (filter === undefined || filter.length <= 0)
        return Match.Unknown
    if (tags === undefined || tags.length <= 0)
        return Match.Unknown
    for (const a of filter) {
        for (const b of tags) {
            if (a == b)
                return Match.Hit
        }
    }
    return Match.Miss
}

function testRange(inRange?: RangeFilterType, against?: number): Match {
    if (!isKnown(against))
        return Match.Unknown
    if (!isKnown(inRange))
        return Match.Unknown
    let range: RangeFilterType = inRange as RangeFilterType
    if (!isKnown_type<number>(range.above) && !isKnown_type<number>(range.below))
        return Match.Unknown
    if (isKnown_type<number>(range.above) && isKnown_type<number>(against) && range.above > against)
        return Match.Miss
    if (isKnown_type<number>(range.below) && isKnown_type<number>(against) && range.below > against)
        return Match.Miss
    return Match.Hit
}

export class retwhy<T> {
    ret: T
    why: string
    constructor(ret:T,why: string) {
        this.ret = ret
        this.why = why
    }
    logret():T {
        console.log(this.why)
        return this.ret
    }
}

class MatchStore {
    match: Match
    why: string
    constructor() {
        this.match = Match.Unknown
        this.why = "unknown"
    }
    safeMatch(item: Match, why: string): void {
        if (this.match === Match.Unknown) {
            this.match = item
            this.why = why
        }
        if (item === Match.Miss) {
            this.match = item
            this.why = why
        }
    }
    final(): boolean {
        return this.match === Match.Miss
    }
    retwhy(): retwhy<boolean> {
        return new retwhy(this.match == Match.Hit,this.why)
    }
}

export function gameMatcher(group: GroupType, game: GameType): retwhy<boolean> {
    const matchStore = new MatchStore()

    const excludeTags: Match = testTags(group.filters.excludeTags, game.tags)
    if (excludeTags === Match.Hit) return new retwhy(false,"exclude by tag")
    matchStore.safeMatch(testRange(group.filters.minPlayers, game.minPlayers),"by minPlayers")
    if (matchStore.final()) return matchStore.retwhy()
    matchStore.safeMatch(testRange(group.filters.maxPlayers, game.maxPlayers),"by maxPlayers")
    if (matchStore.final()) return matchStore.retwhy()
    matchStore.safeMatch(testTags(group.filters.includeTags, game.tags),"by includeTags")
    if (matchStore.final()) return matchStore.retwhy()
    return matchStore.retwhy()
}

export async function setGameGroupMode(group: GroupType, game: GameType, mode: GameGroupMode): Promise<GameGroupType> {
    let gg = await GameGroup.findOne({
        group: group,
        game: game
    })
    if (!isKnown(gg)) {
        gg = await GameGroup.create({
            group: group,
            game: game,
        })
    }
    gg.mode_id = mode
    await gg.save()
    if (mode == GameGroupMode.Exclude) {
        group.games = group.games.filter((g: GameType) => g._id.toString() != game._id.toString())
    } else {
        group.games.push(game)
    }
    await group.save()
    return gg as GameGroupType
}

export function setDateLike(setter: (v: Date | undefined) => void, inVal?: string | Date) {
    // if (typeof body[key] === "undefined")
    //     return;
    // const inVal = body[key];
    if (typeof inVal === "undefined")
        return
    if (inVal === null) {
        setter(undefined)
    } else if (inVal instanceof Date) {
        setter(inVal)
    } else if (inVal == "now") {
        setter(new Date())
    } else {
        setter(new Date(inVal))
    }
}

// ### Environment ###

interface has_toString {
    toString(): string
};

function isStringable(value: has_toString | undefined): value is has_toString {
    if (typeof value === 'undefined') return false
    if ((value as has_toString).toString) {
        return true
    }
    return false
}

function safeToString(thing?: has_toString): string | undefined {
    if (isStringable(thing)) {
        return thing.toString()
    }
    return undefined
}

// ###
export function beString(thing?: has_toString | string): string | undefined {
    if (isStringable(thing)) {
        return thing.toString()
    }
    return thing
}

interface has_id {
    _id: has_toString | string | undefined
}

export function isHasId(value: has_id | has_toString | string | undefined): value is has_id {
    if (typeof value === 'undefined') return false
    if ((value as has_id)._id) {
        return true
    }
    return false
}

export function idString(thing?: has_id | has_toString | string): string | undefined {
    if (isHasId(thing)) {
        return beString(thing._id)
    }
    return beString(thing)
}

export function quotemeta(str: string) {
    return str.replace(/(\W)/g, '\\$1')
}



// ###

export namespace getEnv {
    export function Exists(key: string): boolean {
        return process.env[key] !== undefined
    }

    export function String(key: string, default_value?: string): string {
        if (process.env[key] === undefined) {
            if (default_value !== undefined)
                return default_value
            throw new Error(`Environment variable ${key} is required`)
        }
        return (process.env[key] as unknown as string)
    }

    export function Number(key: string, default_value?: number): number {
        return +String(key, safeToString(default_value))
    }

    export function Boolean(key: string, default_value?: boolean): boolean {
        const val = String(key, safeToString(default_value))
        try {
            return JSON.parse(val.toLowerCase())
        }
        catch (e) {
            try {
                return !!+val
            } catch (e2) {
                throw new Error(`Environment variable ${key} must be a boolean`)
            }
        }
    }
}
