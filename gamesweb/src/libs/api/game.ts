import { GameType } from "../types/Game"
import { PlayModeType } from "../types/PlayMode"
import { apibase } from "./apibase"
let debug = require("debug")("api_game")


export class api_game extends apibase {
    static url(subpath: string): string {
        return apibase.url("coop/" + subpath)
    }
    url(subpath: string): string {
        return api_game.url(subpath)
    }

    async get(id: string): Promise<GameType> {
        console.log("get game")
        let ret = await this.req("GET", `/${id}`)
        console.log("got game")
        return ret.game
    }

    async playmodes(gameid: string): Promise<PlayModeType[]> {
        debug("get playmodes")
        let ret = await this.req("GET", `/${gameid}/playmode`)
        return ret.playmodes
    }

    async getAll(): Promise<GameType[]> {
        debug("get all games")
        let ret = await this.req("GET", '/')
        return ret.games
    }

    async vote(gameid: string, vote: "Desire" | "Accept" | "Vote") {
        debug("vote")
        let ret = await this.req("POST", `/${gameid}/vote`, {
            vote
        })
        return ret
    }

    async addPlaymode(gameid: string, playmode: PlayModeType) {
        debug("add playmode")
        let ret = await this.req("POST", `/${gameid}/playmode`, playmode)
        return ret
    }

}
