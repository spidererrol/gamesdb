import React from "react"
import { useEffect, useState } from "react"
import { isKnown } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import { CloudItem } from "../../libs/types/CloudItem"
import { IPager } from "./IPager"
import Pager from "./Pager"

interface GCProps extends GeneralProps {
    getItems: CloudItem[]
    pager?: IPager
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>, item: CloudItem) => void
}

function GenericCloud(props: GCProps) {
    let pager = <></>
    if (isKnown(props.pager))
        pager = <Pager pager={props.pager as IPager} {...props} />
    const [items, setItems] = useState<JSX.Element[]>([])
    useEffect(() => {
        if (isKnown(props.onClick)){
            let cb = props.onClick as Function
            setItems(props.getItems.map(i => <div key={i.key} className="item" onClick={(e) => cb(e, i)}>{i.display}</div>))
        }else
            setItems(props.getItems.map(i => <div key={i.key} className="item" >{i.display}</div>))
    }, [props, props.getItems])
    return <>
        {pager}
        <div className="cloud">{items}</div>
    </>
}

export default GenericCloud