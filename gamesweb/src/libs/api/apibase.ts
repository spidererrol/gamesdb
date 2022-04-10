
export class apibase {
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
        return apibase.url(subpath)
    }

    static async req(method: "GET" | "POST" | "PATCH" | "DELETE", url: string, headers: any, sendData?: any): Promise<any> {
        let reqobj: any = {
            method: method,
            headers: headers,
        }
        if (sendData !== undefined) {
            reqobj.headers["Content-Type"] = "application/json"
            reqobj.body = JSON.stringify(sendData)
        }
        console.log("🚀 ~ file: apibase.ts ~ line 35 ~ apibase ~ req ~ method", method)
        console.log("🚀 ~ file: apibase.ts ~ line 36 ~ apibase ~ req ~ url", url)
        let match = url.match(/(\/NEW\/|\/undefined\/)/)
        if (match !== null) {
            console.error(`Request contains ${match[0]} - assuming invalid`)
            // return { status: "error", message: "Invalid 'NEW' in request" }
            throw new Error(`Invalid ${match[0]} in request`)
        }
        let req = await fetch(url, reqobj)
        if (req.ok) {
            console.log("ok")
            const ct = req.headers.get("Content-Type")
            console.log("Content-Type: " + ct)
            try {
                if (ct === null) {
                    console.log("ct is null")
                    return null
                }
                if (ct.includes("json")) {
                    console.log("is json")
                    return req.json()
                } else {
                    console.error("ct is not json!")
                    throw new Error("Not JSON: " + await req.text())
                }
            } catch (error: any) {
                console.error("Error decoding request" + error.message)
                throw new Error("Decoding failed: " + error.message)
            }
        } else {
            console.error("Request failed")
            const ct = req.headers.get("Content-Type")
            if (ct === null) {
                console.log("ct is null")
                return null
            }
            if (ct.includes("json")) {
                console.log("is json")
                let data: any = await req.json()
                console.log("🚀 ~ file: apibase.ts ~ line 75 ~ apibase ~ req ~ data.message", data.message)
                throw new Error(data.message)
            } else {
                console.error("ct is not json!")
                throw new Error("Not JSON: " + await req.text())
            }
        }
    }

    async req(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, sendData?: any): Promise<any> {
        return apibase.req(method, this.url(path), {
            "Authorization": `Bearer ${this.authtok}`,
        }, sendData)
    }
}


