import { NextFunction, Request, Response } from 'express'
import { badAuth, isKnown, log_debug, useShim } from '../libs/utils'
import { Login } from '../models/games'
import { randomUUID } from 'crypto'
import '../libs/type-extensions'
import config from '../libs/config'
import { UserType } from '../schemas/User'

// export done below!
async function auth(req: Request, res: Response, next: NextFunction) {
    let authHeader = req.header("Authorization")
    let token: string
    if (authHeader?.startsWith("Bearer ")) {
        let parts = authHeader.split(" ")
        token = parts[1]
    } else {
        log_debug("Invalid header")
        badAuth(res)
        return
    }
    let login = await Login.findOne({ token: token }).populate('user').exec()
    if (!isKnown(login)) {
        log_debug("No such token")
        badAuth(res)
        return
    }
    if (login.expires < new Date()) {
        log_debug("Token expired")
        badAuth(res)
        return
    }
    let myuser = login.user
    if (!isKnown(myuser)) {
        badAuth(res)
        return
    }
    req.myUser = myuser
    next()
}

async function logout(req: Request, res: Response) {
    let authHeader = req.header("Authorization")
    let token: string
    if (authHeader?.startsWith("Bearer ")) {
        let parts = authHeader.split(" ")
        token = parts[1]
    } else {
        log_debug("Invalid header")
        badAuth(res)
        return
    }
    let result = await Login.findOneAndDelete({ token: token })
    res.status(201).json({ status: "success", result: result })
}

// export done below!
async function setUser(req: Request, res: Response, user: UserType, base: any) {
    await Login.find({ expires: { "$lt": new Date() } }).deleteMany()
    let token = randomUUID()
    let expires = new Date()
    expires.setDate(expires.getDate() + config.AUTHDAYS)
    let login = new Login({
        user: user._id,
        token: token,
        expires: expires,
    })
    let dbLogin = await login.save()
    base.token = dbLogin.token
    res.json(base)
}

const authshim = useShim(auth)
export default {
    auth: authshim,
    setUser: setUser,
    logout: logout,
}