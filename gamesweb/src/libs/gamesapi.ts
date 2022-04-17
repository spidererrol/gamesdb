import { api_admin } from "./api/admin"
import { apibase } from "./api/apibase"
import { api_auth } from "./api/auth"
import { api_game } from "./api/game"
import { api_group } from "./api/group"
import { api_user } from "./api/user"
import AuthTok from "./AuthTok"

export class propcache {
    apicache: Map<string, apibase>
    constructor() {
        this.apicache = new Map<string, apibase>()
    }

    get_prop<T extends apibase>(prop: string, setter: () => T) {
        if (!this.apicache.has(prop))
            this.apicache.set(prop, setter())
        return this.apicache.get(prop) as T
    }
}

export class gamesapi extends propcache {
    _authtok: AuthTok

    constructor(authtok: AuthTok) {
        super()
        this._authtok = authtok
    }

    get authtok() {
        return this._authtok.get
    }
    set authtok(newtok: string) {
        this._authtok.set(() => newtok)
    }

    get auth(): api_auth {
        return this.get_prop("auth", () => new api_auth(this.authtok))
    }

    get user(): api_user {
        return this.get_prop("user", () => new api_user(this.authtok))
    }

    get group(): api_group {
        return this.get_prop("group", () => new api_group(this.authtok))
    }

    get game(): api_game {
        return this.get_prop("game", () => new api_game(this.authtok))
    }

    get admin(): api_admin {
        return this.get_prop("admin", () => new api_admin(this.authtok))
    }
}