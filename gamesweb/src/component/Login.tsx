import React from 'react'
import { api_user } from "../libs/api/user"
import { api_auth } from "../libs/api/auth"
import AuthTok from '../libs/AuthTok'
import { InputRefObject } from '../libs/types/InputRefObject'
import { anyElement } from '../libs/types/helpers'
import Register from './Register'

interface Props {
    authTok: AuthTok
    user: any
}

interface State {
    loginError: string
    registerError: string
    registerSuccess: anyElement
}

class Login extends React.Component<Props, State> {
    userRef: InputRefObject
    passRef: InputRefObject

    constructor(props: Props) {
        super(props)
        this.userRef = React.createRef()
        this.passRef = React.createRef()
        this.state = {
            loginError: "",
            registerError: "",
            registerSuccess: <></>,
        }
    }

    async actualLogin(name?: string, pass?: string) {
        this.setState({ loginError: "" })
        if (name === undefined || name === '') return
        if (pass === undefined || pass === '') return

        // console.log("Tim Woz Ere")
        // console.log(process.env.NODE_ENV)
        // console.log(process.env["REACT_APP_API_URL"])
        // console.log(name)

        let auth
        try {
            console.log("start login")
            auth = await api_auth.login(name, pass)
            console.log("login okish")
        } catch (err: any) {
            console.log("login failed: " + err.message)
            this.setState({ loginError: err.message })
            return
        }
        this.props.authTok.set(auth.authtok)
        let user
        try {
            user = await new api_user(auth.authtok).get()
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
        this.actualLogin(name, pass)
    }

    render() {
        return (
            <>
                <fieldset className="login">
                    <legend>Login</legend>
                    {this.state.loginError !== "" && <p className='error'>{this.state.loginError}</p>}
                    <form onSubmit={async (e) => await this.doLogin(e)}>
                        <div><label htmlFor="login_username">Username</label><input id="login_username" ref={this.userRef} type="text" name="username" placeholder='Username' /></div>
                        <div><label htmlFor="login_password">Password</label><input id="login_password" ref={this.passRef} type="password" name="password" placeholder='Password' /></div>
                        <input type="submit" value="Login" />
                    </form>
                </fieldset>
                <Register />
            </>
        )
    }
}

export default Login