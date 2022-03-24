import { isKnown } from "../../libs/utils"

interface OIProps_common {
    maxPrice: number | null,

}

interface OIProps_owned extends OIProps_common {
    owned: string,
}

interface OIProps_parts extends OIProps_common {
    isOwned: boolean | null
    isInstalled: boolean | null
}

type OIProps = OIProps_owned | OIProps_parts

function isOIProps_owned(props: OIProps): props is OIProps_owned {
    if ((props as OIProps_owned).owned)
        return true
    return false
}

function isOIProps_parts(props: OIProps): props is OIProps_parts {
    if ((props as OIProps_owned).owned)
        return false
    return true
}

function OwnedIcon(inprops: OIProps) {
    let props: OIProps_owned
    if (isOIProps_owned(inprops)) {
        props = inprops
    } else if (isOIProps_parts(inprops)) {
        if (inprops.isInstalled)
            props = { ...inprops, owned: "Installed" }
        else if (inprops.isOwned)
            props = { ...inprops, owned: "Owned" }
        else
            props = { ...inprops, owned: "Unowned" }
    } else {
        throw new Error("Out of cheese error!")
    }
    let classes = "ownedicon owned_" + props.owned
    let icon = "?"
    if (props.owned === "Unowned") {
        if (!isKnown(props.maxPrice)) {
            icon = "£"
        } else if (props.maxPrice === 0) {
            icon = "free"
        } else {
            icon = "£" + (props.maxPrice as number).toFixed(2)
        }
    }
    if (props.owned === "Owned")
        icon = "O"
    if (props.owned === "Installed")
        icon = "I"
    return <span className={classes} title={props.owned}>{icon}</span>
}

export default OwnedIcon