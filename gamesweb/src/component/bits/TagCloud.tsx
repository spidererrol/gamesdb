import { useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { GeneralProps } from "../props/GeneralProps"

interface TCProps extends GeneralProps {
    includeTags: string[]
    excludeTags: string[]
}

function TagCloud(props: TCProps) {
    const [tagelements, setTagElemenets] = useState<anyElementList>([])

    useEffect(() => {
        let out: anyElementList = []
        for (const tag of props.includeTags) {
            out.push(<div key={tag} className="tag Include">{tag}</div>)
        }
        for (const tag of props.excludeTags) {
            out.push(<div key={tag} className="tag Exclude">{tag}</div>)
        }
        setTagElemenets(out)
    }, [props.excludeTags, props.includeTags])

    return <>
        <div className="tagcloud">
            {tagelements}
        </div>
    </>
}

export default TagCloud