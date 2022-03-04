import express, { Router } from 'express'
import { createHmac, randomBytes } from 'crypto'
import config from './config'
import { Games, Users, Group } from '../models/games'

// ### FUNCTIONS ###

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

export function handleError(err: any, res: express.Response): void {
    if (err instanceof Error) {
        if (config.DEBUG) {
            res.status(500).json({ status: "error", message: err.message, stack: err.stack })
        } else {
            res.status(500).json({ status: "error", message: err.message })
        }
    } else {
        res.status(500).json({ status: "error", message: "Unknown Error" })
    }
    return
}

export function isKnown(value: any): boolean {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function badAuth(res: express.Response) {
    res.status(400).json({ message: "Please log in." })
}

export function bindRouterPath(router: Router, method: "get" | "post" | "patch" | "delete", path: string, func: actionFunc) {
    switch (method.toLowerCase()) {
        case "get":
            router.get(path, reqShim(func))
            break
        case "post":
            router.post(path, reqShim(func))
            break
        case "patch":
            router.patch(path, reqShim(func))
            break
        case "delete":
            router.delete(path, reqShim(func))
            break
        default:
            throw new Error("Out of cheese. Please reboot universe!")
    }
}

export function setupParams(app: express.Router) {
    app.param("game", async (req, res, next, game_id) => {
        let game = await Games.findById(game_id)
        if (!isKnown(game)) {
            res.status(404).json({ status: "error", message: "No such game" })
            return
        }
        (req as express.Request).reqGame = game
        next()
    })
    app.param("user", async (req, res, next, user_id) => {
        let user = await Users.findById(user_id)
        if (!isKnown(user)) {
            res.status(404).json({ status: "error", message: "No such user" })
            return
        }
        (req as express.Request).myUser = user
        next()
    })
    app.param("group", async (req, res, next, group_id) => {
        let group = await Group.findById(group_id)
        if (!isKnown(group)) {
            res.status(404).json({ status: "error", message: "No such group" })
            return
        }
        (req as express.Request).reqGroup = group
        next()
    })


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