import { faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type AddButtonAction = (e: React.MouseEvent<HTMLButtonElement>) => void

interface ABProps {
    onClick?: AddButtonAction
    type?: "button" | "submit" | "reset"
}

/**
 * 
 * @param onClick (e: React.MouseEvent<HTMLButtonElement>) => void
 * @param type "button" | "submit" | "reset"
 */
function AddButton(props: ABProps) {
    return <button type={props.type} className="AddButton" onClick={props.onClick}><FontAwesomeIcon icon={faSquarePlus} /></button>
}

export default AddButton