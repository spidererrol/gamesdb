import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import gamesroute from './routes/games';
import { Users } from './models/games';
declare module "express-session" {
    interface Session {
        userId: string;
    }
}
declare module "express" {
    interface Request {
        myUser: any; // I don't have a type definition for User.
    }
}

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session.userId === undefined) {
        res.status(400).json({ message: "Please log in." });
        return;
    }
    let myuser = Users.findById(req.session.userId);
    if (myuser === undefined) {
        res.status(400).json({ message: "Please log in." });
        return;
    }
    req.myUser = myuser;
    next();
}


function log_debug(msg: string) {
    console.log(msg);
}

dotenv.config();

const app = express();

mongoose.connect('mongodb://localhost/games').catch((err: any) => { console.error('DB Error: ' + err.message) });
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.on('open', () => log_debug("Connected to database"));

app.use(express.json);
// app.use(session({
//     secret: 'testing',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 },
// }));
//TODO: login page before auth middleware!
// app.use((auth as ()=>{}));
app.use('/coop', gamesroute);

app.listen(3000, () => log_debug("Server Started"));
