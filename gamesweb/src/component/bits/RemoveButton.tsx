import { faSquareMinus } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonAction } from "./ClearButton"

export type RemoveButtonAction = (e: React.MouseEvent<HTMLButtonElement>) => void

interface RBProps_base {
    type?: "button" | "submit" | "reset"
}

interface RBProps_basic extends RBProps_base {
    onClick?: RemoveButtonAction
}

interface RBProps_data extends RBProps_base {
    onClick: ButtonAction,
    data: any
}

type RBProps = RBProps_basic | RBProps_data

function isDataProps(props: RBProps): props is RBProps_data {
    if ((props as RBProps_data).data)
        return true
    return false
}

/**
 * 
 * @param onClick (e: React.MouseEvent<HTMLButtonElement>) => void
 * @param type "button" | "submit" | "reset"
 */
function RemoveButton(props: RBProps) {
    if (isDataProps(props))
        return <button type={props.type} className="RemoveButton" onClick={(e)=>props.onClick(e,props.data)}><FontAwesomeIcon icon={faSquareMinus} /></button>
    return <button type={props.type} className="RemoveButton" onClick={props.onClick}><FontAwesomeIcon icon={faSquareMinus} /></button>
}

export default RemoveButton