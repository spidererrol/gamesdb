import { createRef, useCallback } from "react"
import { GeneralProps } from "../props/GeneralProps"

interface MMEProps extends GeneralProps {
    id_prefix: string,
    display: string,
    minSetter: Function,
    minGetter: number | undefined,
    maxSetter: Function,
    maxGetter: number | undefined,
}

function nummer(str: string | undefined) {
    if (str === undefined)
        return undefined
    if (str === "")
        return undefined
    return +str
}

function MinMaxEdit(props: MMEProps) {
    const minref = createRef<HTMLInputElement>()
    const maxref = createRef<HTMLInputElement>()

    const update = useCallback(e => {
        props.minSetter(nummer(minref.current?.value))
        props.maxSetter(nummer(maxref.current?.value))
    }, [maxref, minref, props])

    return <fieldset className="MinMaxEdit">
        <legend>{props.display}</legend>
        <input type="number" ref={minref} placeholder="≥" value={props.minGetter ?? ""} className="smallnumber" onChange={update} />
        <input type="number" ref={maxref} placeholder="≤" value={props.maxGetter ?? ""} className="smallnumber" onChange={update} />
    </fieldset>
}

export default MinMaxEdit