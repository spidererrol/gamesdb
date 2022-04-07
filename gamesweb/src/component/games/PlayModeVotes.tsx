import { PlayModeType } from "../../libs/types/PlayMode"
import VoteEdit from "../bits/VoteEdit"
import { PlayModeChangeEventHandler } from "./EditPlayMode"
import { useIndexedCallback } from "../../libs/useIndexedCallback"
import OwnedEdit from "../bits/OwnedEdit"

interface PMVProps {
    playmode: PlayModeType
    // gameid: string
    ownedStateUpdate?: PlayModeChangeEventHandler
    ownedPriceUpdate?: PlayModeChangeEventHandler
    voteUpdate?: PlayModeChangeEventHandler
}

/**
 * 
 * @param playmode current playmode
 * @param ownedStateUpdate callback
 * @param ownedPriceUpdate callback
 * @param voteUpdate callback
 */
function PlayModeVotes(props: PMVProps) {
    // I ignore "included" because I want to be able to set ownership regardless.
    return <div className="PlayMode PlayModeVotes">
        <div className="name_icons">
            <div className="name">{props.playmode.name}</div>
            <div className="icons">
                <VoteEdit vote={props.playmode.myVote.vote} setter={useIndexedCallback(props.playmode._id, props.voteUpdate)} />
                <OwnedEdit {...props.playmode.myOwner} selectSetter={useIndexedCallback(props.playmode._id, props.ownedStateUpdate)} priceSetter={useIndexedCallback(props.playmode._id, props.ownedPriceUpdate)} />
            </div>
        </div>
        <div className="description">
            {props.playmode.description}
        </div>
    </div>
}

export default PlayModeVotes
