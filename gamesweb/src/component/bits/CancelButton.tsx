import { faBan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonAction } from "./DelButton"

interface CBProps {
    onClick: ButtonAction
    data: any
    title?: string
}

function CancelButton(props: CBProps) {
    return <button className="CancelButton" onClick={(e) => props.onClick(e, props.data)} title={props.title}><FontAwesomeIcon icon={faBan} /></button>
}

export default CancelButton