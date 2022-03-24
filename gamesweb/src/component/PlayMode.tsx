import { useEffect, useState } from "react"
import { PlayModeProgressType, PlayModeType } from "../libs/types/PlayMode"
import { GeneralProps } from "./props/GeneralProps"
import OwnedIcon from "./bits/OwnedIcon"
import VoteIcon from "./bits/VoteIcon"

interface PMProps extends GeneralProps {
    playmode: PlayModeType
    groupid: string
    gameid: string
}

function PlayMode(props: PMProps) {
    const [progress, setProgress] = useState<PlayModeProgressType>({
        ownedState: {
            state: "Loading...",
            maxPrice: 0.0,
        },
        voteState:{
            vote:"Loading...",
        }
    } as PlayModeProgressType)
    useEffect(() => {
        props.api.group.getProgress(props.groupid, props.playmode._id.toString()).then(p => setProgress(p))
    }, [props.api.group, props.groupid, props.playmode._id])
    return <div className="PlayMode">
        <div className="name">{props.playmode.name}</div>
        <div className="icons">
            <VoteIcon vote={progress.voteState.vote} />
            <OwnedIcon owned={progress.ownedState.state} maxPrice={progress.ownedState.maxPrice} />
        </div>
    </div>
}

export default PlayMode