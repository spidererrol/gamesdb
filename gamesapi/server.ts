import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import './libs/schemainit'
import apiroute from './routes/api'
import './libs/type-extensions'
import { log_debug } from './libs/utils'
import config from "./libs/config"
import './libs/dbinit'
import cors from 'cors'

const app = express()

app.use(cors()) //FIXME: Should be properly configured for production.

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
app.use(express.static("gamesweb/build"))

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

app.use('/api', apiroute)

app.use('/', (req, res) => {
    // This is to allow ReactJS routes

    res.sendFile(process.cwd() + "/gamesweb/build/index.html")
})

app.listen(config.API_PORT, () => log_debug("Server Started"))
