interface VIProps {
    vote: string
}

function VoteIcon(props: VIProps) {
    let classes = "voteicon vote_" + props.vote
    let icon = "?"
    if (props.vote === "Accept")
        icon = "√"
        if (props.vote === "Veto")
        icon = "×"
        if (props.vote === "Desire")
        icon = "*"
    return <span className={classes} title={props.vote}>{icon}</span>
}

export default VoteIcon