import { useCallback, useEffect, useState } from "react"
import { api_auth } from "../libs/api/auth"
import { api_user } from "../libs/api/user"
import AuthTok from "../libs/AuthTok"
import { anyElementList } from "../libs/types/helpers"
import { UserType } from "../libs/types/User"
import Loading from "./bits/Loading"

interface Props {
    authTok: AuthTok
    user: any
}

function DebugLogin(props: Props) {
    const [getUsers, setUsers] = useState<UserType[]>([])
    const [getButtons, setButtons] = useState<anyElementList>([<Loading key="LOADING" caller="DebugLogin" />])

    const doLogin = useCallback(async (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault()
        const name = (e.target as HTMLInputElement).value
        if (name === undefined || name === '') return
        // if (pass === undefined || pass === '') return

        // console.log("Tim Woz Ere")
        // console.log(process.env.NODE_ENV)
        // console.log(process.env["REACT_APP_API_URL"])
        // console.log(name)

        let auth
        try {
            console.warn("start DEBUG login")
            auth = await api_auth.debuglogin(name)
            console.log("login okish")
        } catch (err: any) {
            console.log("login failed: " + err.message)
            // this.setState({ loginError: err.message })
            return
        }
        props.authTok.set(auth.authtok)
        let user
        try {
            user = await new api_user(auth.authtok).get()
        } catch (error: any) {
            throw new Error("Failed to get user: " + error.message)
        }
        props.user.set(user.user)
        // console.log(user)
        console.log("login complete")
        return
    }, [props.authTok, props.user])

    useEffect(() => {
        api_auth.getUsers().then(u => setUsers(u))
    }, [])

    useEffect(() => {
        if (getUsers.length > 0)
            setButtons(getUsers.map(u => <input key={u._id} type="button" onClick={doLogin} value={u.loginName} />))
    }, [doLogin, getUsers])

    return <fieldset className="debug_login">
        <legend>Quick Logins (debug)</legend>
        {getButtons}
    </fieldset>

}

export default DebugLogin