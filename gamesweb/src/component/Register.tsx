import { createRef, useCallback, useState } from "react"
import { useParams } from "react-router-dom"
import { api_auth } from "../libs/api/auth"
import { anyElement } from "../libs/types/helpers"

interface RProps {
}

function Register(props: RProps) {
    const [registerError, setRegisterError] = useState<string>()
    const [registerSuccess, setRegisterSuccess] = useState<anyElement>()

    const regTokenRef = createRef<HTMLInputElement>()
    const regDispRef = createRef<HTMLInputElement>()
    const regUserRef = createRef<HTMLInputElement>()
    const regPassRef = createRef<HTMLInputElement>()
    const regConfirmRef = createRef<HTMLInputElement>()

    const params = useParams()

    const register = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setRegisterError("")
        setRegisterSuccess(<></>)
        const tok = regTokenRef.current?.value
        const disp = regDispRef.current?.value
        const user = regUserRef.current?.value
        const pass = regPassRef.current?.value
        const confirm = regConfirmRef.current?.value
        // eslint-disable-next-line eqeqeq
        if (pass != confirm) {
            setRegisterError("Passwords do not match")
            return
        }
        if (tok === undefined || tok === '') return
        if (user === undefined || user === '') return
        if (pass === undefined || pass === '') return
        if (disp === undefined || disp === '') return
        try {
            await api_auth.register(tok, user, pass, disp)
            setRegisterSuccess(<div className="success">Success! Please login.</div>)
        } catch (err: any) {
            setRegisterError(err.message)
        }

    }, [regConfirmRef, regDispRef, regPassRef, regTokenRef, regUserRef])


    return <><fieldset className="register">
        <legend>Register</legend>
        {registerError !== "" && <p className='error'>{registerError}</p>}
        <form onSubmit={register}>
            <div><label htmlFor="reg_token">Registration Token</label><input id="reg_token" ref={regTokenRef} type="text" name="tok" placeholder='Registration Token' defaultValue={params.regtoken} /></div>
            <div><label htmlFor="reg_displayname">Display Name</label><input id="reg_displayname" ref={regDispRef} type="text" name="displayname" placeholder='Display Name' /></div>
            <div><label htmlFor="reg_username">Username</label><input id="reg_username" ref={regUserRef} type="text" name="username" placeholder="Username" /></div>
            <div><label htmlFor="reg_password">Password</label><input id="reg_password" ref={regPassRef} type="password" name="password" placeholder="Password" /></div>
            <div><label htmlFor="reg_confirm">Confirm</label><input id="reg_confirm" ref={regConfirmRef} type="password" name="password" placeholder="Confirm" /></div>
            <input type="submit" value="Register" />
            {registerSuccess}
        </form>
    </fieldset>
    </>
}

export default Register


