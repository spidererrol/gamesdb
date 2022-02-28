import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import gamesroute from './routes/games';
import authroute from './routes/auth';
import './libs/type-extensions';
import { log_debug, runNext } from './libs/utils';
import config from "./libs/config";
import './libs/dbinit';
import auth from './auth';

const app = express();

// app.use((req, res, next) => { log_debug("REQUEST 1"); runNext(next); });
app.use(express.json());
app.use(session({
    secret: 'testing',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));
app.use('/auth', authroute);
app.use(auth.auth);
// app.use((req,res,next)=>{log_debug("REQUEST 2"); runNext(next);});
app.use('/coop', gamesroute);

app.listen(config.API_PORT, () => log_debug("Server Started"));
