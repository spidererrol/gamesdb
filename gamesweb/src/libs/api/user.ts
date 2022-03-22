import { apibase } from "./apibase"
import { GroupType } from "../types/Group"
import { UserType } from "../types/User"
import { RegTokenType } from "../types/RegToken"


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

    async getAll(): Promise<UserType[]> {
        let ret = await this.req("GET", "all")
        return ret.users as UserType[]
    }

    async getRegTokens(): Promise<RegTokenType[]> {
        let ret = await this.req("GET", "regtoken")
        return ret.regtokens as RegTokenType[]
    }

    addRegToken(token: string, registrations?: number, expires?: Date) {
        return this.req("POST","regtoken",{
            token,
            registrations,
            expires
        })
    }

}
