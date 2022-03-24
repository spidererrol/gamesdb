import React, { createRef, useCallback, useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { isKnown } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"

interface TSEProps extends GeneralProps {
    incexc: "Include" | "Exclude"
    getter: string[]
    setter: React.Dispatch<React.SetStateAction<string[]>>
}

function TagSetEdit(props: TSEProps) {
    const [tagelements, setTagElemenets] = useState<anyElementList>([])
    const newtag_ref = createRef<HTMLInputElement>()
    const [errmsg, setErrMsg] = useState<string>("")

    const deltag = useCallback((e, tag) => {
        e.preventDefault()
        props.setter(props.getter.filter(t => t !== tag))
    }, [props])

    useEffect(() => {
        let out: anyElementList = []
        for (const tag of props.getter) {
            out.push(<div key={tag} className="tag">{tag}<button onClick={e => deltag(e, tag)} className="deltag">X</button></div>)
        }
        setTagElemenets(out)
    }, [deltag, props.getter])

    const addtag = useCallback((e) => {
        e.preventDefault()
        let tags = [...props.getter]
        let newtag = newtag_ref.current?.value.toLocaleLowerCase()
        if (isKnown(newtag) && newtag !== "") {
            if (tags.includes(newtag as string)) {
                setErrMsg("Tag already exists")
            } else {
                setErrMsg("")
                tags.push(newtag as string)
                props.setter(tags);
                (newtag_ref.current as HTMLInputElement).value = ""
            }
        }
    }, [newtag_ref, props])

    const enter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addtag(e)
        }
    }, [addtag])

    return <fieldset className={`TagSetEdit ${props.incexc}`}>
        <legend>{props.incexc} Tags</legend>
        <p className="error">{errmsg}</p>
        <div className="tagset">
            {tagelements}
        </div>
        <input id={"add_" + props.incexc + "_tag"} ref={newtag_ref} type="text" onKeyPress={enter} /><button onClick={addtag} className="addtag">Add</button>
    </fieldset>
}

export default TagSetEdit