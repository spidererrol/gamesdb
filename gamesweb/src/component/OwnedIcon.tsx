import { isKnown } from "../libs/utils"

interface OIProps {
    owned: string,
    maxPrice: number,
}

function OwnedIcon(props: OIProps) {
    let classes = "ownedicon owned_" + props.owned
    let icon = "?"
    if (props.owned === "Unowned") {
        if (!isKnown(props.maxPrice)) {
            icon = "U"
        } else if (props.maxPrice === 0) {
            icon = "free"
        } else {
            icon = "£" + props.maxPrice.toFixed(2)
        }
    }
    if (props.owned === "Owned")
        icon = "O"
    if (props.owned === "Installed")
        icon = "I"
    return <span className={classes} title={props.owned}>{icon}</span>
}

export default OwnedIcon