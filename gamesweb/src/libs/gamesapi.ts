import { apibase } from "./api/apibase"
import { api_auth } from "./api/auth"
import { api_game } from "./api/game"
import { api_group } from "./api/group"
import { api_user } from "./api/user"
import AuthTok from "./AuthTok"

export class gamesapi {
    _authtok: AuthTok
    apicache: Map<string, apibase>

    constructor(authtok: AuthTok) {
        this._authtok = authtok
        this.apicache = new Map<string, apibase>()
    }

    get authtok() {
        return this._authtok.get
    }
    set authtok(newtok: string) {
        this._authtok.set(() => newtok)
    }

    get auth() {
        if (!this.apicache.has("auth"))
            this.apicache.set("auth", new api_auth(this.authtok))
        return this.apicache.get("auth") as api_auth
    }

    get user() {
        if (!this.apicache.has("user"))
            this.apicache.set("user", new api_user(this.authtok))
        return this.apicache.get("user") as api_user
    }

    get group() {
        if (!this.apicache.has("group"))
            this.apicache.set("group", new api_group(this.authtok))
        return this.apicache.get("group") as api_group
    }

    get game() {
        if (!this.apicache.has("game"))
            this.apicache.set("game", new api_game(this.authtok))
        return this.apicache.get("game") as api_game
    }
}