
export class api {
    authtok: string

    constructor(authtok: string = "none") {
        this.authtok = authtok
    }

    static baseurl(): string {
        let baseurl = process.env["REACT_APP_API_URL"]
        if (baseurl !== undefined)
            return baseurl
        else
            throw new Error("REACT_APP_API_URL is not defined")
    }

    static url(subpath: string): string {
        let path = "/" + subpath
        let full = this.baseurl() + path.replaceAll('//', '/')
        return full
    }
    url(subpath: string): string {
        return api.url(subpath)
    }

    async req(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, sendData?: any): Promise<any> {
        let reqobj: any = {
            method: method,
            headers: {
                "Authorization": `Bearer ${this.authtok}`,
            },
        }
        if (sendData !== undefined) {
            reqobj.headers["Content-Type"] = "application/json"
            reqobj.body = JSON.stringify(sendData)
        }
        let url = this.url(path)
        console.log("URL: " + url)
        let req = await fetch(url, reqobj)
        if (req.ok) {
            console.log("ok")
            const ct = req.headers.get("Content-Type")
            console.log("Content-Type: " + ct)
            try {
                if (ct === null) {
                    return null
                }
                if (ct.includes("json")) {
                    console.log("is json")
                    return req.json()
                } else {
                    throw new Error("Not JSON: " + await req.text())
                }
            } catch (error: any) {
                throw new Error("Decoding failed: " + error.message)
            }
        }
        throw new Error("Request failed")
    }

}

export class auth extends api {

    static url(subpath: string): string {
        return api.url("auth/" + subpath)
    }
    url(subpath: string): string {
        return auth.url(subpath)
    }

    static async login(user: string, pass: string): Promise<auth> {
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
            return new auth(data.token)
        } else {
            // console.dir(data)
            // console.dir(errors)
            throw new Error("Login failed")
        }
    }

    async logout(): Promise<any> {
        // console.log("lgout")
        return this.req("GET", "logout")
    }

}

export class user extends api {
    static url(subpath: string): string {
        return api.url("user/" + subpath)
    }
    url(subpath: string): string {
        return user.url(subpath)
    }

    async get(): Promise<any> {
        console.log("get user")
        let ret = await this.req("GET", "/")
        console.log("got user")
        return ret
    }
}
