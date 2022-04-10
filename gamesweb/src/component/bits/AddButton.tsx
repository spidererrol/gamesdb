import { faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonAction } from "./ClearButton"

export type AddButtonAction = (e: React.MouseEvent<HTMLButtonElement>) => void

interface ABProps_base {
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

interface ABProps_basic extends ABProps_base {
    onClick?: AddButtonAction
}

interface ABProps_data extends ABProps_base {
    onClick: ButtonAction,
    data: any
}

type ABProps = ABProps_basic | ABProps_data

function isDataProps(props: ABProps): props is ABProps_data {
    if ((props as ABProps_data).data)
        return true
    return false
}

/**
 * 
 * @param onClick (e: React.MouseEvent<HTMLButtonElement>) => void
 * @param type "button" | "submit" | "reset"
 */
function AddButton(props: ABProps) {
    if (isDataProps(props))
        return <button disabled={props.disabled} type={props.type} className="AddButton" onClick={(e) => props.onClick(e, props.data)}><FontAwesomeIcon icon={faSquarePlus} /></button>
    return <button disabled={props.disabled} type={props.type} className="AddButton" onClick={props.onClick}><FontAwesomeIcon icon={faSquarePlus} /></button>
}

export default AddButton