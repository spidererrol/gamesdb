import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"

interface ELProps {
    href: string,
    display: string,
}

function ExtLink(props: ELProps) {
    const [getDisplay, setDisplay] = useState<anyElement>(props.display)

    useEffect(() => {
        //         if (props.href.startsWith("https://store.steampowered.com/") && props.display === "Steam")
        //             setDisplay(<FontAwesomeIcon icon={faSteam} />)
        // else            if (props.href.startsWith("https://www.co-optimus.com/") && props.display === "Steam")
        //             setDisplay(<FontAwesomeIcon icon={faSteam} />)
        // else            if (props.href.startsWith("https://store.steampowered.com/") && props.display === "Steam")
        //             setDisplay(<FontAwesomeIcon icon={faSteam} />)
        if (props.display.startsWith("https://"))
            setDisplay(<img src={props.display} alt={props.display} title={props.display} className="extlink_icon" />)
        else if (props.display.endsWith("!"))
            setDisplay(props.display.substring(0, props.display.length - 1))
        else if (props.href.startsWith("https://isthereanydeal.com/") && props.display === "IsThereAnyDeal")
            setDisplay(<img src="https://d2uym1p5obf9p8.cloudfront.net/images/favicon.png" alt={props.display} title={props.display} className="extlink_icon" />)
        else if (props.href.startsWith("https://")) {
            let prefix: string
            let pos1 = props.href.indexOf("/", 8)
            prefix = props.href.substring(0, pos1)
            let image = prefix + "/favicon.ico"
            setDisplay(<img src={image} alt={props.display} title={props.display} className="extlink_icon" />)
        }
    }, [props.display, props.href])

    return <div className="link"><a target="_blank" className="extlink" href={props.href} rel="noreferrer">{getDisplay}<FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" className="extlink_mark" /></a></div>
}

export default ExtLink