import express from 'express';
import { badAuth, isKnown, log_debug, useShim } from '../libs/utils';
import { Login, Users } from '../models/games';
import { LoginType, UserType } from '../types/games';
import { randomUUID } from 'crypto';
import '../libs/type-extensions';
import config from '../libs/config';

async function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    let authHeader = req.header("Authorization");
    let token:string;
    if (authHeader?.startsWith("Bearer ")) {
        let parts = authHeader.split(" ");
        token = parts[1];
    } else {
        log_debug("Invalid header");
        badAuth(res);
        return;
    }
    let login = await Login.findOne({token: token}).populate('user').exec();
    if (!isKnown(login)) {
        log_debug("No such token");
        badAuth(res);
        return;
    }
    if (login.expires < new Date()) {
        log_debug("Token expired");
        badAuth(res);
        return;
    }
    let myuser = login.user;
    if (!isKnown(myuser)) {
        badAuth(res);
        return;
    }
    req.myUser = myuser;
    next();
}

async function setUser(req: express.Request, res: express.Response, user: UserType, base: any) {
    let token = randomUUID();
    let expires = new Date();
    expires.setDate(expires.getDate() + config.AUTHDAYS);
    let login = new Login({
        user: user._id,
        token: token,
        expires: expires,
    });
    let dbLogin = await login.save();
    base.token = dbLogin.token;
    res.json(base);
}

const authshim = useShim(auth);
export default {
    auth: authshim,
    setUser: setUser,
};