import { PlayModeType } from "../../libs/types/PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import OwnedIcon from "../bits/OwnedIcon"
import VoteIcon from "../bits/VoteIcon"

interface PMProps extends GeneralProps {
    playmode: PlayModeType
    gameid: string
}

function PlayMode(props: PMProps) {
    return <div className="PlayMode">
        <div className="name">{props.playmode.name}</div>
        <div className="icons">
            <VoteIcon vote={props.playmode.myVote.vote} />
            <OwnedIcon {...props.playmode.myOwner} />
        </div>
        <div className="description">
            {props.playmode.description}
        </div>
    </div>
}

export default PlayMode