import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import './libs/schemainit'
import gamesroute from './routes/games'
import authroute from './routes/auth'
import userroute from './routes/user'
import grouproute from './routes/group'
import './libs/type-extensions'
import { log_debug, runNext } from './libs/utils'
import config from "./libs/config"
import './libs/dbinit'
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

app.listen(config.API_PORT, () => log_debug("Server Started"))
