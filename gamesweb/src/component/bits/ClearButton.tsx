import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ButtonAction = (e: React.MouseEvent<HTMLButtonElement>, data: any) => void

interface CBProps {
    onClick: ButtonAction
    data: any
    title?: string
}

function ClearButton(props: CBProps) {
    return <button className="ClearButton" onClick={(e) => props.onClick(e, props.data)} title={props.title}><FontAwesomeIcon icon={faCircleXmark} /></button>
}

export default ClearButton