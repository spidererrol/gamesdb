import { useState, useEffect } from "react"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import ExtLink from "../bits/ExtLink"
import Loading from "../bits/Loading"
import { GeneralProps } from "../props/GeneralProps"

interface GLProps extends GeneralProps {
    game: GameType
}

function GameLinks(props: GLProps) {
    let [links, setLinks] = useState<anyElementList>([<Loading key="loading" caller="GameLinks/links" />])
    useEffect(() => {
        if (props.game.links !== undefined) {
            let out: anyElementList = []
            for (const link in props.game.links) {
                out.push(
                    // <div key={link} className="link"><a className="extlink" href={props.game.links[link]}>{link}</a></div>
                    <ExtLink key={link} href={props.game.links[link]} display={link} />
                )
            }
            setLinks(out)
        } else {
            setLinks([])
        }
    }, [props.game.links])
    return <div className="links">{links}</div>
}

export default GameLinks