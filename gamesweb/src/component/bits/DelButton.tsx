import { faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ButtonAction = (e: React.MouseEvent<HTMLButtonElement>, data: any) => void

interface DBProps {
    onClick: ButtonAction
    data: any
    title?: string
}

function DelButton(props: DBProps) {
    return <button className="DelButton" onClick={(e) => props.onClick(e, props.data)} title={props.title??"Delete"}><FontAwesomeIcon icon={faTrashCan} /></button>
}

export default DelButton