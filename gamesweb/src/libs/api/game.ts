import { GameType } from "../types/Game"
import { PlayModeType } from "../types/PlayMode"
import { idString } from "../utils"
import { apibase } from "./apibase"
let debug = require("debug")("api_game")


export type VoteNames = "Desire" | "Accept" | "Vote" | "None"

export type SimpleOwnershipType = {
    isOwned?: boolean
    isInstalled?: boolean
    maxPrice?: number | null
}

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

    async search(term: string): Promise<GameType[]> {
        debug("game search " + term)
        let ret = await this.req("GET",`/search/${term}`)
        return ret.games
    }

    async vote(gameid: string, vote: VoteNames) {
        debug("vote")
        let ret = await this.req("POST", `/${gameid}/vote`, {
            vote
        })
        return ret
    }

    async ownership(gameid: string, { isOwned, isInstalled, maxPrice }: SimpleOwnershipType) {
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

    //bindPath(['patch','post'],"/:game/playmode/:playmode/vote",playmode.vote)
    //bindPath(['patch','post'],"/:game/playmode/:playmode/owned",playmode.setOwnership)
    async playmodeVote(gameid: string, playmodeid: string, vote: VoteNames): Promise<any> {
        debug("playmode vote")
        let ret = await this.req("POST", `/${gameid}/playmode/${playmodeid}/vote`, { vote })
        return ret
    }

    async playmodeOwnership(gameid: string, playmodeid: string, { isOwned, isInstalled, maxPrice }: SimpleOwnershipType): Promise<any> {
        debug("playmode Ownership")
        let setobj: any = {}
        if (isOwned !== undefined)
            setobj.ownedSince = isOwned ? "now" : null
        if (isInstalled !== undefined)
            setobj.installedSince = isInstalled ? "now" : null
        if (maxPrice !== undefined)
            setobj.maxPrice = maxPrice
        let ret = await this.req("PATCH", `/${gameid}/playmode/${playmodeid}/owned`, setobj)
        return ret
    }

    async addPlaymode(gameid: string, playmode: PlayModeType) {
        debug("add playmode")
        let ret = await this.req("POST", `/${gameid}/playmode`, playmode)
        return ret
    }

    async delPlaymode(gameid: string, playmodeid: string) {
        debug("del playmode")
        let ret = await this.req("DELETE", `/${gameid}/playmode/${playmodeid}`)
        return ret
    }

    async updatePlaymode(gameid: string, playmode: PlayModeType) {
        debug("update playmode")
        let ret = await this.req("PATCH", `/${gameid}/playmode/${playmode._id}`, playmode)
        return ret.after
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

    async del(game_or_id: string | GameType) {
        let gameid = idString(game_or_id) as string
        let ret = await this.req("DELETE", `/${gameid}`)
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
