import { PlayModeType } from "../../libs/types/PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import OwnedIcon from "../bits/OwnedIcon"
import VoteIcon from "../bits/VoteIcon"
import { useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"
import Loading from "../bits/Loading"

interface PMProps extends GeneralProps {
    playmode: PlayModeType
    gameid: string
}

function PlayMode(props: PMProps) {
    const [owned, setOwned] = useState<anyElement>(<Loading caller="PlayMode/owned" />)
    useEffect(() => {
        if (props.playmode.included)
            setOwned(<div className="owned_included">inc</div>)
        else
            setOwned(<OwnedIcon {...props.playmode.myOwner} />)
    }, [props.playmode.included, props.playmode.myOwner])
    return <div className="PlayMode">
        <div className="name_icons">
            <div className="name">{props.playmode.name}</div>
            <div className="icons">
                <VoteIcon vote={props.playmode.myVote.vote} />
                {owned}
            </div>
        </div>
        <div className="description">
            {props.playmode.description}
        </div>
    </div>
}

export default PlayMode