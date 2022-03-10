import { apibase } from "./apibase"
import { GroupType } from "../types/Group"


export class api_user extends apibase {
    static url(subpath: string): string {
        return apibase.url("user/" + subpath)
    }
    url(subpath: string): string {
        return api_user.url(subpath)
    }

    async get(): Promise<any> {
        console.log("get user")
        let ret = await this.req("GET", "/")
        console.log("got user")
        return ret
    }

    async memberships(): Promise<GroupType[]> {
        let ret = await this.req("GET", "memberships")
        return ret.memberships as GroupType[]
    }

}
