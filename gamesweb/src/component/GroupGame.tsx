import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { GameType } from "../libs/types/Game"
import { GameGroupType } from "../libs/types/GameGroup"
import { PlayModeType } from "../libs/types/PlayMode"
import { GeneralProps } from "./props/GeneralProps"
import OwnedIcon from "./bits/OwnedIcon"
import PlayMode from "./PlayMode"
import VoteIcon from "./bits/VoteIcon"
import { faCheckToSlot, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface GGProps extends GeneralProps {
    groupid: string
    gameid: string
}

function GroupGame(props: GGProps) {
    const [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    const [game, setGame] = useState<GameType>({ name: "Loading..." } as GameType)
    const [gamegroup, setGameGroup] = useState<GameGroupType>({ voteState: { vote: "Loading..." }, ownedState: { state: "Loading..." } } as GameGroupType)
    const [playmodes, setPlayModes] = useState<any[]>([<div key="loading" className="loading">Loading...</div>])
    useEffect(() => {
        props.api.game.playmodes(props.gameid).then((p) => setdbPlaymodes(p))
        props.api.game.get(props.gameid).then((g) => setGame(g))
        props.api.group.gamegroup(props.groupid, props.gameid).then((g) => setGameGroup(g))
    }, [props])
    useEffect(() => {
        let out: any[] = []
        for (const playmode of dbplaymodes) {
            out.push(<PlayMode playmode={playmode} {...props} />)
        }
        setPlayModes(out)
    }, [dbplaymodes, props])
    return (
        <div className={["GroupGame", "vote_" + gamegroup.voteState.vote, "owned_" + gamegroup.ownedState.state].join(" ")}>
            <div className="editvote">
                <NavLink to={game._id === undefined ? "" : "/games/" + game._id.toString() + "/vote"} className="editvote">
                    <FontAwesomeIcon icon={faCheckToSlot} /><FontAwesomeIcon icon={faWallet} />
                </NavLink>
            </div>
            <div className="header">
                <NavLink to={game._id === undefined ? "" : "/games/" + game._id.toString() + "/edit"} className="name">{game.name}</NavLink>
                <div className="icons effective">
                    <VoteIcon vote={gamegroup.voteState.vote} />
                    <OwnedIcon owned={gamegroup.ownedState.state} maxPrice={gamegroup.ownedState.maxPrice} />
                </div>
                <div className="icons user">
                    <VoteIcon vote={game.myVote?.vote ?? "Unknown"} />
                    <OwnedIcon isOwned={game.myOwner?.isOwned ?? null} isInstalled={game.myOwner?.isInstalled ?? null} maxPrice={game.myOwner?.maxPrice ?? null} />
                </div>
            </div>
            <div className="playmodes">{playmodes}</div>
        </div>
    )
}

export default GroupGame