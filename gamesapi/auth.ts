import config from "./libs/config"

const auth = require('./auth/' + config.AUTHTYPE)

export default auth.default