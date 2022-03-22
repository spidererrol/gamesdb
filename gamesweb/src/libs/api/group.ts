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

    async gamegroup(groupid: string, gameid: string) {
        debug("get gamegroup")
        let ret = await this.req("GET", `/${groupid}/${gameid}`)
        return ret.gamegroup
    }

    async getProgress(groupid: string, playmodeid: string) {
        debug("get progress")
        let ret = await this.req("GET", `/${groupid}/progress/${playmodeid}`)
        return ret.progress
    }

    async getAvailable(): Promise<GroupType[]> {
        debug("get groups")
        let ret = await this.req("GET", "/available")
        return ret.groups
    }

    async create(newgroup: any) {
        debug("create group")
        let ret = await this.req("POST", "/create", newgroup)
        return ret
    }

    async update(groupid: string, newgroup: any) {
        debug("update group")
        let ret = await this.req("PATCH", `/${groupid}`, newgroup)
        return ret
    }

    async del(groupid: string) {
        debug("delete group")
        let ret = await this.req("DELETE", `/${groupid}`)
        return ret
    }

    async join(groupid: string) {
        debug("join group")
        let ret = await this.req("GET", `/${groupid}/join`)
        return ret
    }

    async leave(groupid: string) {
        debug("leave group")
        let ret = await this.req("GET", `/${groupid}/leave`)
        return ret
    }

    async invite(groupid: string, userid: string) {
        debug("invite")
        let ret = await this.req("GET", `/${groupid}/invite/${userid}`)
        return ret
    }

    async expel(groupid: string, userid: string) {
        debug("expel")
        let ret = await this.req("GET", `/${groupid}/expel/${userid}`)
        return ret
    }
}
