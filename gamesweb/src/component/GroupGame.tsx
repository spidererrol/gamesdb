import { useEffect, useState } from "react"
import { GameType } from "../libs/types/Game"
import { GameGroupType } from "../libs/types/GameGroup"
import { GeneralProps } from "./GeneralProps"
import OwnedIcon from "./OwnedIcon"
import VoteIcon from "./VoteIcon"

interface GGProps extends GeneralProps {
    groupid: string
    gameid: string
}

function GroupGame(props: GGProps) {
    const [dbplaymodes, setdbPlaymodes] = useState<any[]>([<div className="loading">Loading...</div>])
    const [game, setGame] = useState<GameType>({ name: "Loading..." } as GameType)
    const [gamegroup, setGameGroup] = useState<GameGroupType>({ voteState: { vote: "Loading..." }, ownedState: { state: "Loading..." } } as GameGroupType)
//TODO: get group.getProgress in order to get voteState & ownerState for group+game
    useEffect(() => {
        props.api.game.playmodes(props.gameid).then((p) => setdbPlaymodes(() => p))
        props.api.game.get(props.gameid).then((g) => setGame(g))
        props.api.group.gamegroup(props.groupid, props.gameid).then((g) => setGameGroup(g))
    }, [props])
    useEffect(() => {

    }, [dbplaymodes])
    return (
        <div className={["GroupGame", "vote_" + gamegroup.voteState.vote, "owned_" + gamegroup.ownedState.state].join(" ")}>
            <div className="header">
                <div className="name">{game.name}</div>
                <VoteIcon vote={gamegroup.voteState.vote} />
                <OwnedIcon owned={gamegroup.ownedState.state} maxPrice={gamegroup.ownedState.maxPrice} />
            </div>
        </div>
    )
}

export default GroupGame