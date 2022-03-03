import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import './libs/schemainit'
import gamesroute from './routes/games'
import authroute from './routes/auth'
import userroute from './routes/user'
import grouproute from './routes/group'
import testroute from './routes/test'
import './libs/type-extensions'
import { isKnown, log_debug, runNext } from './libs/utils'
import config from "./libs/config"
import './libs/dbinit'
import { Games, Group, Users } from './models/games'
import auth from './auth'

const app = express()

// app.use((req, res, next) => { log_debug("REQUEST 1"); runNext(next); });
app.use(express.json())
app.use(session({
    secret: 'testing',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}))
app.set('view engine', 'ejs')
app.set('view options', {
    views: ["gamesapi/views/"],
})
app.use(express.static("gamesapi/public"))

// Start dev only:
import fs from 'fs'
if (fs.existsSync("TODO.html"))
    app.get('/TODO.html', (req, res) => {
        res.status(200)
        res.contentType("text/html")
        res.header("Refresh", "10")
        res.sendFile(process.cwd() + "/TODO.html")
    })
// End dev only

app.use('/auth', authroute)
app.use(auth.auth)
// app.use((req,res,next)=>{log_debug("REQUEST 2"); runNext(next);});
app.use('/coop', gamesroute)
app.use('/user', userroute)
app.use('/group', grouproute)
app.use('/test', testroute)

app.param("group", async (req, res, next, group_id) => {
    let group = await Group.findById(group_id)
    if (!isKnown(group)) {
        res.status(404).json({ status: "error", message: "No such group" })
        return
    }
    (req as express.Request).myGroup = group
    next()
})
app.param("game", async (req, res, next, game_id) => {
    let game = await Games.findById(game_id)
    if (!isKnown(game)) {
        res.status(404).json({ status: "error", message: "No such game" })
        return
    }
    (req as express.Request).myGame = game
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

app.listen(config.API_PORT, () => log_debug("Server Started"))
