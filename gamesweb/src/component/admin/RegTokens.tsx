import { createRef, useCallback, useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { RegTokenType } from "../../libs/types/RegToken"
import LabelInput from "../bits/LabelInput"
import Loading from "../bits/Loading"
import { GeneralProps } from "../props/GeneralProps"

function RegTokens(props: GeneralProps) {
    const [toks, setToks] = useState<RegTokenType[]>([])
    const [tok_elements, setTokElements] = useState<anyElementList>([<Loading key="loading" />])
    const [error, setError] = useState<string>("")

    const token_ref = createRef<HTMLInputElement>()
    const registrations_ref = createRef<HTMLInputElement>()
    const expires_ref = createRef<HTMLInputElement>()

    useEffect(() => {
        props.api.user.getRegTokens().then(results => setToks(results))
    }, [props.api.user, props.dbupdates.regtokens])
    useEffect(() => {
        setTokElements(toks.map((rt: RegTokenType) => <div key={rt._id} className="token">
            <div className="name">{rt.token}</div>
            <div className="limit">{rt.registrations ?? "unlimited"}</div>
            <div className="expires">{rt.expires?.toString() ?? "forever"}</div>
        </div>))
    }, [toks])

    const addtoken = useCallback((e) => {
        e.preventDefault()
        let token = token_ref.current?.value as string
        if (token === "") {
            // setError("Token is required!")
            // throw new Error("Token is required!")
            token = (Math.random() * 1000000).toFixed(0).padStart(6,"0")
        }
        setError("")
        let registrations: number | undefined
        if (registrations_ref.current?.value !== undefined)
            registrations = Number.parseInt(registrations_ref.current?.value)
        if (registrations === 0)
            registrations = undefined
        let expires: Date | undefined
        if (expires_ref.current?.value !== undefined)
            expires = new Date(expires_ref.current?.value)
        props.api.user.addRegToken(token, registrations, expires).then(() => props.dbupdate("regtokens"))
    }, [expires_ref, props, registrations_ref, token_ref])

    return <div className="RegTokens">
        {tok_elements}
        <fieldset className="new">
            <legend>New Token</legend>
            <p className="error">{error}</p>
            <form onSubmit={addtoken}>
                <LabelInput type="text" ref={token_ref} label="Token" name="token" placeholder="RANDOM" {...props} />
                <LabelInput type="number" ref={registrations_ref} label="Max Registrations" name="registrations" placeholder="No Limit" min={0} {...props} />
                <LabelInput type="datetime-local" ref={expires_ref} label="Expires" name="expires" placeholder="Never" {...props} />
                <input type="submit" value="Add" />
            </form>
        </fieldset>
    </div>
}

export default RegTokens