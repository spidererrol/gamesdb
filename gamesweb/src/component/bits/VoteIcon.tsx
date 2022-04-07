import { faStar, faQuestion, faBan, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface VIProps {
    vote: string
}

function VoteIcon(props: VIProps) {
    let classes = "voteicon vote_" + props.vote
    let icon = faQuestion
    if (props.vote === "Accept")
        icon = faThumbsUp
    if (props.vote === "Dislike")
        icon = faThumbsDown
    if (props.vote === "Veto")
        icon = faBan
    if (props.vote === "Desire")
        icon = faStar
    return <span className={classes} title={props.vote}><FontAwesomeIcon icon={icon} /></span>
}

export default VoteIcon