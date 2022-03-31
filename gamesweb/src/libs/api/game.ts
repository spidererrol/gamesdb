import { GameType } from "../types/Game"
import { PlayModeType } from "../types/PlayMode"
import { apibase } from "./apibase"
let debug = require("debug")("api_game")


export type VoteNames = "Desire" | "Accept" | "Vote" | "None"

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

    async vote(gameid: string, vote: VoteNames) {
        debug("vote")
        let ret = await this.req("POST", `/${gameid}/vote`, {
            vote
        })
        return ret
    }

    async ownership(gameid: string, { isOwned, isInstalled, maxPrice }: { isOwned?: boolean; isInstalled?: boolean; maxPrice?: number | null }) {
        debug("ownership")
        let setobj: any = {}
        if (isOwned !== undefined)
            setobj.ownedSince = isOwned ? "now" : null
        if (isInstalled !== undefined)
            setobj.installedSince = isInstalled ? "now" : null
        if (maxPrice !== undefined)
            setobj.maxPrice = maxPrice
        let ret = await this.req("PATCH", `/${gameid}/owned`, setobj)
        return ret
    }

    async addPlaymode(gameid: string, playmode: PlayModeType) {
        debug("add playmode")
        let ret = await this.req("POST", `/${gameid}/playmode`, playmode)
        return ret
    }

    async update(game: GameType, gameid?: string) {
        if (gameid === undefined)
            gameid = game._id
        const gameupdate = {
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            aliases: game.aliases,
            links: game.links,
            tags: game.tags,
        }
        let ret = await this.req("PATCH", `/${gameid}`, gameupdate)
        return ret
    }

    async add(game: GameType): Promise<GameType> {
        const gameupdate = {
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            aliases: game.aliases,
            links: game.links,
            tags: game.tags,
        }
        let ret = await this.req("POST", `/`, gameupdate)
        return ret.game
    }

}
