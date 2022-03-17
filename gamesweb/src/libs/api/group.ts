import { apibase } from "./apibase"
import { GroupType } from "../types/Group"
let debug = require("debug")("api_group")


export class api_group extends apibase {
    static url(subpath: string): string {
        return apibase.url("group/" + subpath)
    }
    url(subpath: string): string {
        return api_group.url(subpath)
    }

    async get(id: string): Promise<GroupType> {
        console.log("get group")
        let ret = await this.req("GET", `/${id}`)
        console.log("got group")
        return ret.group
    }

    async gamegroup(groupid: string,gameid: string) {
        debug("get gamegroup")
        let ret = await this.req("GET",`/${groupid}/${gameid}`)
        return ret.gamegroup
    }

    async getProgress(groupid: string,playmodeid: string) {
        debug("get progress")
        let ret = await this.req("GET",`/${groupid}/progress/${playmodeid}`)
        return ret.progress
    }

    async getAll(): Promise<GroupType[]> {
        debug("get groups")
        let ret = await this.req("GET","/")
        return ret.groups
    }
}
