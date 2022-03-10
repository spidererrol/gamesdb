import React from 'react'
import { api_user } from "../libs/api/user"
import { api_auth } from "../libs/api/auth"
import AuthTok from '../libs/AuthTok'

interface Props {
    authTok: AuthTok
    user: any
}

interface State {
    loginError: string
    registerError: string
    registerSuccess: boolean
}

type InputRefObject = React.RefObject<HTMLInputElement>

class Login extends React.Component<Props, State> {
    userRef: InputRefObject
    passRef: InputRefObject
    regDispRef: InputRefObject
    regUserRef: InputRefObject
    regPassRef: InputRefObject
    regConfirmRef: InputRefObject
    regTokenRef: InputRefObject

    constructor(props: Props) {
        super(props)
        this.userRef = React.createRef()
        this.passRef = React.createRef()
        this.regDispRef = React.createRef()
        this.regUserRef = React.createRef()
        this.regPassRef = React.createRef()
        this.regConfirmRef = React.createRef()
        this.regTokenRef = React.createRef()
        this.state = {
            loginError: "",
            registerError: "",
            registerSuccess: false,
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

    async testLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.actualLogin("tim", "timtest")
    }

    async register(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.setState({ registerError: "", registerSuccess: false })
        const tok = this.regTokenRef.current?.value
        const disp = this.regDispRef.current?.value
        const user = this.regUserRef.current?.value
        const pass = this.regPassRef.current?.value
        const confirm = this.regConfirmRef.current?.value
        // eslint-disable-next-line eqeqeq
        if (pass != confirm) {
            this.setState({ registerError: "Passwords do not match" })
            return
        }
        if (tok === undefined || tok === '') return
        if (user === undefined || user === '') return
        if (pass === undefined || pass === '') return
        if (disp === undefined || disp === '') return
        try {
            await api_auth.register(tok, user, pass, disp)
            this.setState({ registerSuccess: true })
        } catch (err: any) {
            this.setState({ registerError: err.message })
        }

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
                <fieldset className="register">
                    <legend>Register</legend>
                    {this.state.registerError !== "" && <p className='error'>{this.state.registerError}</p>}
                    <form onSubmit={async (e) => await this.register(e)}>
                        <div><label htmlFor="reg_token">Registration Token</label><input id="reg_token" ref={this.regTokenRef} type="text" name="tok" placeholder='Registration Token' /></div>
                        <div><label htmlFor="reg_displayname">Display Name</label><input id="reg_displayname" ref={this.regDispRef} type="text" name="displayname" placeholder='Display Name' /></div>
                        <div><label htmlFor="reg_username">Username</label><input id="reg_username" ref={this.regUserRef} type="text" name="username" placeholder="Username" /></div>
                        <div><label htmlFor="reg_password">Password</label><input id="reg_password" ref={this.regPassRef} type="password" name="password" placeholder="Password" /></div>
                        <div><label htmlFor="reg_confirm">Confirm</label><input id="reg_confirm" ref={this.regConfirmRef} type="password" name="password" placeholder="Confirm" /></div>
                        <input type="submit" value="Register" />
                    </form>
                </fieldset>
                <fieldset className="dev">
                    <legend>Dev Login</legend>
                    <form onSubmit={async (e) => await this.testLogin(e)}>
                        <input type="submit" value="Test Login" />
                    </form>
                </fieldset>
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