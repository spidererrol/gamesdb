import React, { createRef, Key, useCallback } from "react"
import { useEffect, useState } from "react"
import { CloudItem } from "../../libs/types/CloudItem"
import { anyElement, anyElementList } from "../../libs/types/helpers"
import { isKnown, mapmap } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import AddButton from "./AddButton"
import DelButton from "./DelButton"
import { IPager } from "./IPager"
import Pager from "./Pager"

type clickCBType = (event: React.MouseEvent<HTMLElement, MouseEvent>, item: CloudItem) => void
type delCBType = (event: React.MouseEvent<HTMLButtonElement>, item: CloudItem) => void
type AddItemCBType = (newTag: string) => void

interface GECProps extends GeneralProps {
    getItems: Map<Key, CloudItem>
    pager?: IPager
    onClick?: clickCBType
    delItem?: delCBType
    addItem?: AddItemCBType
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
    const addInputRef = createRef<HTMLInputElement>()
    const abCallback = useCallback(
        e => {
            e.preventDefault()
            console.log("Blah")
            const addItem = props.addItem as AddItemCBType
            addItem(addInputRef.current?.value as string);
            (addInputRef.current as HTMLInputElement).value = ""
        },
        [addInputRef, props.addItem]
    )
    useEffect(() => {
        let clickCB: clickCBType = (e, i) => { }
        if (isKnown(props.onClick)) {
            clickCB = props.onClick as clickCBType
        }
        if (isKnown(props.delItem)) {
            let delCB = props.delItem as delCBType
            setItems(mapmap(props.getItems, (k, i) => <div key={i.key} className="item" onClick={(e) => clickCB(e, i)}>{i.display}<DelButton onClick={delCB} data={i} /></div>))
        } else {
            setItems(mapmap(props.getItems, (k, i) => <div key={i.key} className="item" onClick={(e) => clickCB(e, i)}>{i.display}</div>))
        }
        if (isKnown(props.addItem)) {
            setAddButton(<div className="addform"><input type="text" ref={addInputRef} /><AddButton onClick={abCallback} /></div>)
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props, props.getItems] // Don't add callbacks to this - that causes a loop. Even adCallback which is already a useCallback!
    )

    return <>
        {pager}
        <div className="cloud">{items}{addButton}</div>
    </>
}

export default GenericEditCloud