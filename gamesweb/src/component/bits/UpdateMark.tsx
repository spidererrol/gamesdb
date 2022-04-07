import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

export enum UpdateState {
    None,
    Updating,
    Updated
}

interface UMProps {
    state?: UpdateState
}

const baseClasses = "UpdateMark"

function UpdateMark(props: UMProps) {
    const [getClasses, setClasses] = useState(baseClasses)
    useEffect(() => {
        switch (props.state) {
            case UpdateState.Updating:
                setClasses(`${baseClasses} Updating pulse`)
                break
            case UpdateState.Updated:
                setClasses(`${baseClasses} Updated fadeOut`)
                break
            default:
                setClasses(`${baseClasses} None`)
        }
    }, [props.state])
    return <div className={getClasses}><FontAwesomeIcon icon={faFloppyDisk} /></div>
}

export default UpdateMark