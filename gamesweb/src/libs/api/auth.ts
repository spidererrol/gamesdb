import { UserType } from "../types/User"
import { devMode } from "../utils"
import { apibase } from "./apibase"


export class api_auth extends apibase {

    static url(subpath: string): string {
        return apibase.url("auth/" + subpath)
    }
    url(subpath: string): string {
        return api_auth.url(subpath)
    }

    static async getUsers(): Promise<UserType[]> {
        if (!devMode()) return []
        let ret = await this.req("GET",this.url("debuglogin"),{})
        return ret.users
    }

    static async debuglogin(user: string): Promise<api_auth> {
        // console.log("try login")
        // console.log(this.url("auth/login"))
        let req = await fetch(this.url("debuglogin"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                // secret: pass,
            })
        })
        // console.log("post login")
        let data = await req.json()
        // console.dir(data)
        // console.dir(errors)
        if (req.ok) {
            // console.log("req.ok")
            return new api_auth(data.token)
        } else {
            // console.dir(data)
            // console.dir(errors)
            throw new Error("Login failed: " + data.message)
        }
    }

    static async login(user: string, pass: string): Promise<api_auth> {
        // console.log("try login")
        // console.log(this.url("auth/login"))
        let req = await fetch(this.url("login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                secret: pass,
            })
        })
        // console.log("post login")
        let data = await req.json()
        // console.dir(data)
        // console.dir(errors)
        if (req.ok) {
            // console.log("req.ok")
            return new api_auth(data.token)
        } else {
            // console.dir(data)
            // console.dir(errors)
            throw new Error("Login failed: " + data.message)
        }
    }

    logout(): Promise<any> {
        // console.log("lgout")
        return this.req("GET", "logout")
    }

    /*
    # @name register
    POST {{authurl}}register
    Content-Type: application/json
    
    {"username":"tim","secret":"timtest","displayname":"Tim"}
    
    */
    static register(regtoken: string, username: string, secret: string, displayname: string): Promise<any> {
        return api_auth.req("POST", this.url("register"), {}, {
            regtoken,
            username,
            secret,
            displayname
        })
    }

}
