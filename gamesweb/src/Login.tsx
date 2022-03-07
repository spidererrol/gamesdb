import React from 'react'

export interface Props {
    setAuthTok: React.Dispatch<React.SetStateAction<string>>
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

    doLogin() {
        // const name = this.userRef.current?.value
        // const pass = this.passRef.current?.value

        // if (name === '') return
        // if (pass === '') return

        console.log("Tim Woz Ere")
        console.log(process.env.NODE_ENV)
        console.log(process.env["REACT_APP_API_URL"])
    }

    render() {
        return (
            <>
                <input ref="userRef" type="text" />
                <input ref="passRef" type="password" />
                <button onClick={this.doLogin}>Login</button>
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