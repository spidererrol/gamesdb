import { Request, Response } from 'express'
import { getList, handleError, isKnown, isKnown_type, log_debug, pw } from '../libs/utils'
import { RegToken, Shadow, Users } from '../models/games'
import { UserType } from "../schemas/User"
import auth from '../auth'
import { ShadowType } from '../schemas/Shadow'
import { HTTPSTATUS } from '../types/httpstatus'
import { RegTokenType } from '../schemas/RegToken'
import config from '../libs/config'

export async function login(req: Request, res: Response) {
    log_debug("Got Login Request")
    // log_debug(req.body)
    try {
        const shadow: ShadowType = await Shadow.findOne({ loginName: req.body.username.toLowerCase() }).exec()
        if (isKnown(shadow) && pw.check(shadow.loginName, req.body.secret, shadow.crypt)) {
            log_debug("Auth Success")
            auth.setUser(req, res, shadow.user, { status: "success", user: shadow.user })
        } else {
            log_debug("Auth Failure")
            res.status(400).json({ status: "failure", message: "Invalid username or password" })
        }
    } catch (err) {
        handleError(err, res)
    }
}

export async function debugLogin(req: Request, res: Response) {
    console.warn("** DEBUG LOGIN REQUESTED **")
    if (!config.DEBUG) return
    console.warn("** DEBUG LOGIN ENABLED **")
    try {
        const shadow: ShadowType = await Shadow.findOne({ loginName: req.body.username.toLowerCase() }).exec()
        if (isKnown(shadow)
            // && pw.check(shadow.loginName, req.body.secret, shadow.crypt)
        ) {
            log_debug("Auth Success")
            auth.setUser(req, res, shadow.user, { status: "success", user: shadow.user })
        } else {
            log_debug("Auth Failure")
            res.status(400).json({ status: "failure", message: "Invalid username or password" })
        }
    } catch (err) {
        handleError(err, res)
    }
}

export async function addRegToken(req: Request, res: Response) {
    if (!req.myUser.isAdmin) {
        res.status(HTTPSTATUS.FORBIDDEN).json({
            status: "error",
            message: "You are not authorised to create RegTokens"
        })
        return
    }
    await cleanRegTokens()
    let oldTok = await RegToken.findOne({ token: req.body.token })
    if (isKnown(oldTok)) {
        res.status(HTTPSTATUS.CONFLICT).json({
            status: "error",
            message: "The requested token already exists"
        })
        return
    }
    let newTok = await RegToken.create({ ...req.body })
    res.json({ status: "success", regtoken: newTok })
}

export async function getRegTokens(req: Request, res: Response) {
    if (!req.myUser.isAdmin) {
        res.status(HTTPSTATUS.FORBIDDEN).json({
            status: "error",
            message: "You are not authorised to create RegTokens"
        })
        return
    }
    await cleanRegTokens()
    let toks = RegToken.find()
    getList({
        listkey: "regtokens",
        query: toks,
        res: res,
        req: req,
    })
}

export async function register(req: Request, res: Response) {
    log_debug("Got Register Request")
    try {
        const userCount = await Users.countDocuments()
        if (userCount == 0) {
            const regtokCount = await RegToken.countDocuments()
            if (regtokCount == 0) {
                await RegToken.create({
                    token: config.INIT_REGTOKEN,
                    registrations: 1,
                })
            }
        }

        if (!isKnown(req.body.regtoken))
            throw new Error("regtoken is required")
        await cleanRegTokens()
        const regtoken = await RegToken.findOne({
            token: req.body.regtoken,
            registrations: { $gt: 0 },
            $or: [
                { expires: null },
                { expires: { $gte: new Date() } }
            ]
        })
        if (!isKnown_type<RegTokenType>(regtoken))
            throw new Error("invalid or expired token")
        const user: UserType = await Users.findOne({ loginName: req.body.username.toLowerCase() }).exec()
        if (isKnown(user)) {
            res.status(400).json({ status: "failure", message: "Username already exists" })
            return
        }
        const newuser = new Users({
            loginName: req.body.username.toLowerCase().trim(),
            displayName: req.body.displayname.trim(),
            isAdmin: userCount == 0,
        })
        const dbUser = await newuser.save()
        const crypt = pw.crypt(req.body.username, req.body.secret)
        const newshadow = Shadow.create({
            loginName: req.body.username,
            crypt: crypt,
            user: dbUser
        })
        if (isKnown_type<number>(regtoken.registrations)) {
            regtoken.registrations--
            await regtoken.save()
        }
        res.status(201).json({ status: "success", user: dbUser })
    } catch (err) {
        handleError(err, res)
    }
}

async function cleanRegTokens() {
    return RegToken.deleteMany({
        $or: [
            { registrations: { $eq: 0 }, },
            { expires: { $lt: new Date() } },
        ]
    })
}

// Internal func, no export!
async function realUpdate(req: Request, res: Response) {
    try {
        const user = req.myUser
        if (!isKnown(user)) {
            res.status(404).json({ status: "failure", message: "Out of cheese error! Please reboot universe" })
            return
        }
        // You can't change loginName/username as that would require changing the password too!
        if (isKnown(req.body.secret)) {
            let shadow = await Shadow.findOne({ user: req.myUser })
            if (!isKnown(shadow)) {
                res.status(HTTPSTATUS.INTERNAL_ERROR).json({ status: "error", message: "Unable to retrieve shadow" })
            }
            shadow.crypt = pw.crypt(user.loginName, req.body.secret)
            await shadow.save()
        }
        if (isKnown(req.body.displayName)) {
            user.displayName = req.body.displayName
        }
        if (isKnown(req.body.displayname)) {
            user.displayName = req.body.displayname
        }
        const dbUser = await user.save()
        res.status(201).json({ status: "success", user: dbUser })
    } catch (err) {
        handleError(err, res)
    }
}

export async function update(req: Request, res: Response) {
    log_debug("Update User")
    // This router is not authenticated already so:
    auth.auth(req, res, realUpdate.bind(null, req, res))
}

export async function logout(req: Request, res: Response) {
    log_debug("Logout User")
    auth.logout(req, res)
}
