import express from 'express';
import { handleError, isKnown, log_debug, pw, reqShim } from '../libs/utils';
import { Users } from '../models/games';
import { UserType } from '../types/games';
import auth from '../auth';

const router = express.Router();

router.post('/login', reqShim(async (req: express.Request, res: express.Response) => {
    log_debug("Got Login Request");
    try {
        const user: UserType = await Users.findOne({ loginName: req.body.username }).exec();
        if (isKnown(user) && pw.check(user.loginName, req.body.secret, user.crypt)) {
            auth.setUser(req, res, user, { status: "success", user: user });
        } else {
            res.status(400).json({ status: "failure", message: "Invalid username or password" });
        }
    } catch (err) {
        handleError(err, res);
    }
}));

router.post('/register', reqShim(async (req: express.Request, res: express.Response) => {
    log_debug("Got Register Request");
    try {
        const user: UserType = await Users.findOne({ loginName: req.body.username }).exec();
        if (isKnown(user)) {
            res.status(400).json({ status: "failure", message: "Username already exists" });
            return;
        }
        const crypt = pw.crypt(req.body.username, req.body.secret);
        const newuser = new Users({
            loginName: req.body.username,
            crypt: crypt,
            displayName: req.body.displayname,
        });
        const dbUser = await newuser.save();
        res.status(201).json({ status: "success", user: dbUser });
    } catch (err) {
        handleError(err, res);
    }
}));

/*
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
*/

export default router;