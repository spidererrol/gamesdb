import { useEffect, useState } from "react"
import { anyElements } from "../../libs/types/helpers"
import { children } from "../props/children"

interface MOProps {
    children?: anyElements
    flagcontent?: anyElements
    wrapper?: (props: children) => JSX.Element
}

function MissingOk(props: MOProps) {
    const [getContent, setContent] = useState<anyElements>(<></>)
    useEffect(() => {
        if (props.flagcontent !== undefined)
            if (props.wrapper)
                setContent(<props.wrapper>{props.children as anyElements}</props.wrapper>)
            else
                setContent(props.children as anyElements)
        else
            setContent(<></>)
    }, [props, props.children, props.flagcontent])
    return <>{getContent}</>
}

export default MissingOk