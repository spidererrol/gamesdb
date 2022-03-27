import { faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type AddButtonAction = (e: React.MouseEvent<HTMLButtonElement>) => void

interface ABProps {
    onClick?: AddButtonAction
}

function AddButton(props: ABProps) {
    return <button className="AddButton" onClick={props.onClick}><FontAwesomeIcon icon={faSquarePlus} /></button>
}

export default AddButton