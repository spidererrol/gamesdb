import express from 'express';
import { badAuth, useShim } from '../libs/utils';
import { Users } from '../models/games';
import { UserType } from '../types/games';
import '../libs/type-extensions';

async function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session.userId === undefined) {
        badAuth(res);
        return;
    }
    let myuser = await Users.findById(req.session.userId);
    if (myuser === undefined) {
        badAuth(res);
        return;
    }
    req.myUser = myuser;
    next();
}

function setUser(req: express.Request, res: express.Response, user: UserType, base: any) {
    req.session.userId = user._id;
    res.json(base);
}

const authshim = useShim(auth);
export default {
    auth: authshim,
    setUser: setUser,
};