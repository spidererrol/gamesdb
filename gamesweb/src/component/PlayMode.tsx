import { useCallback, useEffect, useState } from "react"
import { PlayModeProgressType, PlayModeType } from "../libs/types/PlayMode"
import { GeneralProps } from "./props/GeneralProps"
import OwnedIcon from "./bits/OwnedIcon"
import VoteIcon from "./bits/VoteIcon"
import { safeState } from "../libs/utils"
import { PlayModeProgressValues } from "../libs/types/PlayModeProgressValues"
import PlayModeProgress from "./bits/PlayModeProgress"

interface PMProps extends GeneralProps {
    playmode: PlayModeType
    groupid: string
    gameid: string
}

function PlayMode(props: PMProps) {
    const [getUpdateProgress, setUpdateProgress] = useState<boolean>(true)
    const [progress, setProgress] = useState<PlayModeProgressType>({
        ownedState: {
            state: "Loading...",
            maxPrice: 0.0,
        },
        voteState: {
            vote: "Loading...",
        },
        progress: PlayModeProgressValues.Unplayed,
    } as PlayModeProgressType)
    useEffect(() => {
        let isMounted = true
        if (getUpdateProgress)
            props.api.group.getProgress(props.groupid, props.playmode._id.toString()).then(p => safeState(isMounted, setProgress, p)).then(() => safeState<boolean>(isMounted, setUpdateProgress, false))
        return () => { isMounted = false }
    }, [props.api.group, props.groupid, props.playmode._id, getUpdateProgress])
    const progressUpdated = useCallback(() => {
        setUpdateProgress(true)
        // props.dbupdate("games") // This does work but is a little slow and jumps things around the screen.
        // Maybe bg get the new games list and see where it has moved to and do a nice fadeOut/fadeIn?
        // Probably actually need to cascade up to parent to do that.
    }, [props])
    return <div className="PlayMode">
        <PlayModeProgress progress={progress} afterUpdate={progressUpdated} {...props} />
        <div className="name">{props.playmode.name}</div>
        <div className="icons effective">
            <VoteIcon vote={progress.voteState.vote} />
            <OwnedIcon owned={progress.ownedState.state} maxPrice={progress.ownedState.maxPrice} included={props.playmode.included} />
        </div>
        <div className="icons user">
            <VoteIcon vote={props.playmode.myVote.vote} />
            <OwnedIcon isOwned={props.playmode.myOwner.isOwned} isInstalled={props.playmode.myOwner.isInstalled} maxPrice={props.playmode.myOwner.maxPrice} included={props.playmode.included} />
        </div>
    </div>
}

export default PlayMode