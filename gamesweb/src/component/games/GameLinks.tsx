import { useState, useEffect } from "react"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import Loading from "../bits/Loading"
import { GeneralProps } from "../props/GeneralProps"

interface GLProps extends GeneralProps {
    game: GameType
}

function GameLinks(props: GLProps) {
    let [links, setLinks] = useState<anyElementList>([<Loading key="loading" />])
    useEffect(() => {
        if (props.game.links !== undefined) {
            let out: anyElementList = []
            for (const link in props.game.links) {
                out.push(<div key={link} className="link"><a className="extlink" href={props.game.links[link]}>{link}</a></div>)
            }
            setLinks(out)
        } else {
            setLinks([])
        }
    }, [props.game.links])
    return <div className="links">{links}</div>
}

export default GameLinks