import { createRef, useCallback, useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { RegTokenType } from "../../libs/types/RegToken"
import LabelInput from "../bits/LabelInput"
import Loading from "../bits/Loading"
import Cards from "../cards/Cards"
import { GeneralProps } from "../props/GeneralProps"
import RegToken from "./RegToken"

function forceString(invar?: string | null): string {
    if (invar === undefined)
        return ""
    if (invar === null)
        return ""
    return invar
}
function refString(ref: React.RefObject<HTMLInputElement>): string {
    return forceString(ref.current?.value)
}

function RegTokens(props: GeneralProps) {
    const [toks, setToks] = useState<RegTokenType[]>([])
    const [tok_elements, setTokElements] = useState<anyElementList>([<Loading key="loading" caller="RegToken/tok_elements" />])
    const [error, setError] = useState<string>("")
    const [getAddDisabled, setAddDisabled] = useState<boolean>(true)

    const token_ref = createRef<HTMLInputElement>()
    const registrations_ref = createRef<HTMLInputElement>()
    const expires_ref = createRef<HTMLInputElement>()

    useEffect(() => {
        props.api.user.getRegTokens().then(results => setToks(results))
    }, [props.api.user, props.dbupdates.regtokens])
    useEffect(() => {
        setTokElements(toks.map((rt: RegTokenType) => <RegToken regtoken={rt} {...props} />))
    }, [props, toks])

    const checkValid = useCallback((e) => {
        setAddDisabled(refString(registrations_ref).length <= 0 && refString(expires_ref).length <= 0)
    }, [expires_ref, registrations_ref])

    const addtoken = useCallback((e) => {
        e.preventDefault()
        let token = token_ref.current?.value as string
        if (token === "") {
            // setError("Token is required!")
            // throw new Error("Token is required!")
            token = (Math.random() * 1000000).toFixed(0).padStart(6, "0")
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
        <Cards>
            {tok_elements}
        </Cards>
        <fieldset className="new">
            <legend>New Token</legend>
            <p className="error">{error}</p>
            <form onSubmit={addtoken}>
                <LabelInput type="text" ref={token_ref} label="Token" name="token" placeholder="RANDOM" onChange={checkValid} {...props} />
                <LabelInput type="number" ref={registrations_ref} label="Max Registrations" name="registrations" placeholder="No Limit" min={0} onChange={checkValid} {...props} />
                <LabelInput type="datetime-local" ref={expires_ref} label="Expires" name="expires" placeholder="Never" onChange={checkValid} {...props} />
                <input type="submit" value="Add" disabled={getAddDisabled} />
            </form>
        </fieldset>
    </div>
}

export default RegTokens