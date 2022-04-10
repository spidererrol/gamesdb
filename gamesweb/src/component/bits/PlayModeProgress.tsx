import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faBan, faCheck, faPause, faPersonRunning, faStop, faThumbsDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"
import { PlayModeProgressType, PlayModeType } from "../../libs/types/PlayMode"
import { PlayModeProgressValues } from "../../libs/types/PlayModeProgressValues"
import { FinishedCallback } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import PlayModeProgressEdit from "./PlayModeProgressEdit"

interface PMPProps extends GeneralProps {
    progress: PlayModeProgressType
    groupid: string
    playmode: PlayModeType
    afterUpdate?: FinishedCallback
}

const baseClass = "progress_icon"

function PlayModeProgress(props: PMPProps) {
    const [getClassNames, setClassNames] = useState<string>(baseClass)
    const [getIcon, setIcon] = useState<IconProp>(faStop)
    const [getEdit, setEdit] = useState<anyElement>(<></>)
    const [getEditToggle, setEditToggle] = useState<boolean>(false)

    useEffect(() => {
        setClassNames(baseClass + " " + props.progress)
        switch (props.progress.progress) {
            case PlayModeProgressValues.Unplayed:
                setIcon(faStop)
                break
            case PlayModeProgressValues.Uninterested:
                setIcon(faThumbsDown)
                break
            case PlayModeProgressValues.Playing:
                setIcon(faPersonRunning)
                break
            case PlayModeProgressValues.Paused:
                setIcon(faPause)
                break
            case PlayModeProgressValues.Finished:
                setIcon(faCheck)
                break
            case PlayModeProgressValues.Abandoned:
                setIcon(faBan)
                break
        }
    }, [props.progress])

    useEffect(() => {
        if (getEditToggle)
            setEdit(<PlayModeProgressEdit {...props} />)
        else
            setEdit(<></>)
    }, [getEditToggle, props])

    const edit = useCallback((e) => {
        setEditToggle(!getEditToggle)
    }, [getEditToggle])

    return <div className="progress_icon">
        <FontAwesomeIcon title={props.progress.progress} className={getClassNames} icon={getIcon} onClick={edit} />
        {getEdit}
    </div>

}

export default PlayModeProgress