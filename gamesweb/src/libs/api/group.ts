import { apibase } from "./apibase"
import { GroupType } from "../types/Group"


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

}
