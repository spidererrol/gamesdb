import React from "react"
import { useEffect, useState } from "react"
import { isKnown } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import { IPager } from "./IPager"
import Pager from "./Pager"

/**
 * @property key Unique value for this item.
 * @property id id to pass to onClick method (defaults to key)
 * @property display content for item
 */
export interface CloudItem {
    key: any,
    id?: any,
    display: string | JSX.Element
}

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