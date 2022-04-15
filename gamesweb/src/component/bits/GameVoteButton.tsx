import { faCheckToSlot, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { GeneralProps } from "../props/GeneralProps"

interface GVBProps extends GeneralProps {
    game: GameType
}

function GameVoteButton(props: GVBProps) {
    return <NavLink to={props.game._id === undefined ? "" : "/games/" + props.game._id.toString() + "/vote"} className="GameVoteButton" title="Vote/Ownership">
        <FontAwesomeIcon icon={faCheckToSlot} />
    </NavLink>
}

export default GameVoteButton