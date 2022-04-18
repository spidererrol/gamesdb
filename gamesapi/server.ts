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

// Cors: {
function cors_devel() {
    app.use(cors()) // Enable any access for simplicity
}
function cors_prod() {
    // At this time, live only needs same-origin so cors is not needed.
}
if (process.env["NODE_ENV"] === "development") {
    console.info("Development mode: Setting cors to development profile")
    cors_devel()
} else if (config.DEBUG) {
    console.info("Debug mode: Setting cors to development profile")
    cors_devel()
} else {
    console.info("Production mode: Setting cors to production profile")
    cors_prod()
}
// }

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

app.use('/api', apiroute)

app.use('/', (req, res) => {
    // This is to allow ReactJS routes

    res.sendFile(process.cwd() + "/gamesweb/build/index.html")
})

app.listen(config.API_PORT, () => log_debug("Server Started"))
