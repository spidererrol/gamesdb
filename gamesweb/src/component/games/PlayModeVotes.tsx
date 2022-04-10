import { PlayModeType } from "../../libs/types/PlayMode"
import VoteEdit from "../bits/VoteEdit"
import { useIndexedUpdateCallback } from "../../libs/useIndexedCallback"
import OwnedEdit from "../bits/OwnedEdit"
import { InputChangeUpdateCallback, SelectChangeUpdateCallback } from "../../libs/utils"
import { useState } from "react"
import { UpdateState } from "../bits/UpdateMark"

interface PMVProps {
    playmode: PlayModeType
    // gameid: string
    ownedStateUpdate?: SelectChangeUpdateCallback<string>
    ownedPriceUpdate?: InputChangeUpdateCallback<string>
    voteUpdate?: SelectChangeUpdateCallback<string>
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

    const [getVoteUpdating, setVoteUpdating] = useState<UpdateState>(UpdateState.None)
    const [getOwnedUpdating, setOwnedUpdating] = useState<UpdateState>(UpdateState.None)
    const [getPriceUpdating, setPriceUpdating] = useState<UpdateState>(UpdateState.None)

    return <div className="PlayMode PlayModeVotes">
        <div className="name_icons">
            <div className="name">{props.playmode.name}</div>
            <div className="icons">
                <VoteEdit vote={props.playmode.myVote.vote} setter={useIndexedUpdateCallback(props.playmode._id, props.voteUpdate, setVoteUpdating)} state={getVoteUpdating} />
                <OwnedEdit
                    {...props.playmode.myOwner}
                    selectSetter={useIndexedUpdateCallback(props.playmode._id, props.ownedStateUpdate, setOwnedUpdating)}
                    ownedUpdate={getOwnedUpdating}
                    priceSetter={useIndexedUpdateCallback(props.playmode._id, props.ownedPriceUpdate, setPriceUpdating)}
                    priceUpdate={getPriceUpdating}
                />
            </div>
        </div>
        <div className="description">
            {props.playmode.description}
        </div>
    </div>
}

export default PlayModeVotes
