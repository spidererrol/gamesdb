import React from 'react'
import * as api from './libs/api'
import AuthTok from './libs/AuthTok'

export interface Props {
    authTok: AuthTok
    user: any
}

type InputRefObject = React.RefObject<HTMLInputElement>

class Login extends React.Component<Props> {
    userRef: InputRefObject
    passRef: InputRefObject


    constructor(props: Props) {
        super(props)
        this.userRef = React.createRef()
        this.passRef = React.createRef()
    }

    async actualLogin(name?: string,pass?: string) {
        if (name === undefined || name === '') return
        if (pass === undefined || pass === '') return

        // console.log("Tim Woz Ere")
        // console.log(process.env.NODE_ENV)
        // console.log(process.env["REACT_APP_API_URL"])
        // console.log(name)

        let auth
        try {
            auth = await api.auth.login(name, pass)
        } catch (err) {
            throw err
        }
        this.props.authTok.set(auth.authtok)
        let user
        try {
            user = await new api.user(auth.authtok).get()
        } catch (error: any) {
            throw new Error("Failed to get user: " + error.message)
        }
        this.props.user.set(user.user)
        // console.log(user)
        console.log("login complete")
        return
    }

    async doLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const name = this.userRef.current?.value
        const pass = this.passRef.current?.value
        this.actualLogin(name,pass)
    }

    async testLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.actualLogin("tim","timtest")
    }

    render() {
        return (
            <>
            <form onSubmit={async (e) => await this.doLogin(e)}>
                <input ref={this.userRef} type="text" name="username" />
                <input ref={this.passRef} type="password" name="password" />
                <input type="submit" value="Login" />
            </form>
            <form onSubmit={async (e) => await this.testLogin(e)}>
            <input type="submit" value="Test Login" />
            </form>
            </>
        )
    }
}

export default Login

// export default function Login({ setAuthTok }) {
//     const userRef = useRef()
//     const passRef = useRef()

// function doLogin(e) {
//     const username = userRef.current.value
//     const pass = passRef.current.value
//     if (username === '') return

// }

//     return (
//         <>
//             <input ref="userRef" type="text" />
//             <input ref="passRef" type="password" />
//             <button onClick={doLogin}>Login</button>
//         </>
//     )
// }