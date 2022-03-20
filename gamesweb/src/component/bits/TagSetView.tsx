import { useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { GeneralProps } from "../props/GeneralProps"

interface TSVProps extends GeneralProps {
    incexc: "Include" | "Exclude"
    getter: string[]
}

function TagSetView(props: TSVProps) {
    const [tagelements, setTagElemenets] = useState<anyElementList>([])

    useEffect(() => {
        let out: anyElementList = []
        for (const tag of props.getter) {
            out.push(<div key={tag} className="tag">{tag}</div>)
        }
        setTagElemenets(out)
    }, [props.getter])

    return <fieldset className={`TagSetEdit ${props.incexc}`}>
        <legend>{props.incexc} Tags</legend>
        <div className="tagset">
            {tagelements}
        </div>
    </fieldset>
}

export default TagSetView