import { Request, Response } from 'express'
import { handleError, isKnown, log_debug, pw } from '../libs/utils'
import { Users } from '../models/games'
import { UserType } from "../schemas/User"
import auth from '../auth'

export async function login(req: Request, res: Response) {
    log_debug("Got Login Request")
    try {
        const user: UserType = await Users.findOne({ loginName: req.body.username }).exec()
        if (isKnown(user) && pw.check(user.loginName, req.body.secret, user.crypt)) {
            auth.setUser(req, res, user, { status: "success", user: user })
        } else {
            res.status(400).json({ status: "failure", message: "Invalid username or password" })
        }
    } catch (err) {
        handleError(err, res)
    }
}

export async function register(req: Request, res: Response) {
    log_debug("Got Register Request")
    try {
        const user: UserType = await Users.findOne({ loginName: req.body.username }).exec()
        if (isKnown(user)) {
            res.status(400).json({ status: "failure", message: "Username already exists" })
            return
        }
        const crypt = pw.crypt(req.body.username, req.body.secret)
        const newuser = new Users({
            loginName: req.body.username,
            crypt: crypt,
            displayName: req.body.displayname,
        })
        const dbUser = await newuser.save()
        res.status(201).json({ status: "success", user: dbUser })
    } catch (err) {
        handleError(err, res)
    }
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
            user.crypt = pw.crypt(user.loginName, req.body.secret)
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
