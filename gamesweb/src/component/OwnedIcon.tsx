interface OIProps {
    owned: string,
    maxPrice: number,
}

function OwnedIcon(props: OIProps) {
    let classes = "ownedicon owned_" + props.owned
    let icon = "?"
    if (props.owned === "Unowned")
        icon = "£" + props.maxPrice
        if (props.owned === "Owned")
        icon = "O"
        if (props.owned === "Installed")
        icon = "I"
    return <span className={classes} title={props.owned}>{icon}</span>
}

export default OwnedIcon