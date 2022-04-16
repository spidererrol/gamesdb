import { useEffect, useState } from "react"
import { anyElement, anyElements } from "../../libs/types/helpers"
import { buildClasses } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import { className } from "../props/className"
import { children } from "../props/children"
import CardHeader from "./CardHeader"
import CardBody from "./CardBody"
import CardAction from "./CardAction"
import MissingOk from "../bits/MissingOk"

export interface CardProps extends GeneralProps, className, children {
    header?: anyElements
    titleButtons?: anyElements
    actionButtons?: anyElements
}

function Card(props: CardProps) {
    const [getAction, setAction] = useState<anyElement>(<></>)
    useEffect(() => {
        if (props.actionButtons)
            setAction(<CardAction>{props.actionButtons}</CardAction>)
    }, [props.actionButtons])
    return <div className={buildClasses(props.className, "Card")}>
        <MissingOk flagcontent={props.header}><CardHeader titleButtons={props.titleButtons}>{props.header as anyElements}</CardHeader></MissingOk>
        <CardBody>{props.children}</CardBody>
        {getAction}
    </div>
}

export default Card