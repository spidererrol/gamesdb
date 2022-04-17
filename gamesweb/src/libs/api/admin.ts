import { apibase } from "./apibase"

export class api_admin extends apibase {

    static url(subpath: string): string {
        return apibase.url("admin/" + subpath)
    }
    url(subpath: string): string {
        return api_admin.url(subpath)
    }

    async recalcGames(): Promise<any> {
        console.log("recalc games")
        return this.req("GET", `/recalcGames`)
    }
}
