import React, { Key } from "react"
import { useEffect, useState } from "react"
import { CloudItem } from "../../libs/types/CloudItem"
import { anyElement, anyElementList } from "../../libs/types/helpers"
import { isKnown, mapmap } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import AddButton, { AddButtonAction } from "./AddButton"
import DelButton from "./DelButton"
import { IPager } from "./IPager"
import Pager from "./Pager"

type clickCBType = (event: React.MouseEvent<HTMLElement, MouseEvent>, item: CloudItem) => void
type delCBType = (event: any, item: CloudItem) => void

interface GECProps extends GeneralProps {
    getItems: Map<Key,CloudItem>
    pager?: IPager
    onClick?: clickCBType
    delItem?: delCBType
    addItem?: AddButtonAction
}

/**
 * Display an editable cloud of items.
 * 
 * @param getItems items in the cloud (should be a useState variable)
 * @param pager See Pager
 * @param onClick Respond to clicks on the item WARNING: will also trigger when delItem triggers!
 * @param delItem Respond to click on the delete button
 * @param addItem Respond to click on the add button
 */
function GenericEditCloud(props: GECProps) {
    let pager = <></>
    if (isKnown(props.pager))
        pager = <Pager pager={props.pager as IPager} {...props} />
    const [items, setItems] = useState<anyElementList>([])
    const [addButton, setAddButton] = useState<anyElement>(<></>)
    useEffect(() => {
        let clickCB: clickCBType = (e, i) => { }
        if (isKnown(props.onClick)) {
            clickCB = props.onClick as clickCBType
        }
        if (isKnown(props.delItem)) {
            let delCB = props.delItem as delCBType
            setItems(mapmap(props.getItems,(k,i) => <div key={i.key} className="item" onClick={(e) => clickCB(e, i)}>{i.display}<DelButton onClick={delCB} data={i} /></div>))
        } else {
            setItems(mapmap(props.getItems,(k,i) => <div key={i.key} className="item" onClick={(e) => clickCB(e, i)}>{i.display}</div>))
        }
        if (isKnown(props.addItem))
            setAddButton(<AddButton onClick={props.addItem} />)
    }, [props, props.getItems])

    return <>
        {pager}
        <div className="cloud">{items}{addButton}</div>
    </>
}

export default GenericEditCloud