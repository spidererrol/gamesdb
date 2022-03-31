import { faRecycle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonAction } from "./DelButton"

interface UDBProps {
    onClick: ButtonAction
    data: any
}

function UnDelButton(props: UDBProps) {
    return <button className="UnDelButton" onClick={(e) => props.onClick(e, props.data)}><FontAwesomeIcon icon={faRecycle} /></button>
}

export default UnDelButton