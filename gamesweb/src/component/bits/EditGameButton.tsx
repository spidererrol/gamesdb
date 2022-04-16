import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom"
import { GameType } from "../../libs/types/Game"

interface EGBProps {
    game: GameType
}

function EditGameButton(props: EGBProps) {
    return <NavLink className="edit_button" to={"/games/" + props.game._id + "/edit"} title="Edit Game"><FontAwesomeIcon className="icon editicon" icon={faPenToSquare} /></NavLink>
}

export default EditGameButton