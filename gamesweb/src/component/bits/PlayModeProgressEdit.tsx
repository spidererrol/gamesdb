import { useCallback, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeProgressType, PlayModeType } from "../../libs/types/PlayMode"
import { PlayModeProgressValues } from "../../libs/types/PlayModeProgressValues"
import { FinishedCallback } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"
import UpdateMark, { UpdateState } from "./UpdateMark"

interface PMPEProps extends GeneralProps {
    progress: PlayModeProgressType
    groupid: string
    playmode: PlayModeType
    afterUpdate?: FinishedCallback
}

function PlayModeProgressEdit(props: PMPEProps) {
    const [getUpdateState, setUpdateState] = useState<UpdateState>(UpdateState.None)

    const updateProgress = useCallback((e) => {
        setUpdateState(UpdateState.Updating)
        props.api.group.setProgress(props.groupid, props.playmode._id, e.target.value)
            .then(() => setUpdateState(UpdateState.Updated))
            .then(() => {
                if (props.afterUpdate !== undefined)
                    props.afterUpdate()
            })
    }, [props])

    if (props.progress._id === undefined)
        return <></>

    const options: anyElementList = []
    for (const opt in PlayModeProgressValues) {
        options.push(<option key={opt} value={opt}>{opt}</option>)
    }

    return <span className="edit_progress">
        <select onChange={updateProgress}>{options}</select>
        <UpdateMark state={getUpdateState} />
    </span>
}

export default PlayModeProgressEdit