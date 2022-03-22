import { useEffect, useState } from "react"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import Loading from "../bits/Loading"
import { GeneralProps } from "../props/GeneralProps"
import DisplayGame from "./DisplayGame"

function ListGames(props: GeneralProps) {
    const [data, setData] = useState<GameType[]>([])
    const [games, setGames] = useState<anyElementList>([<Loading key="loading" />])

    useEffect(() => {
        props.api.game.getAll().then(games => setData(games))
    }, [props.api.game,props.dbupdates.games])
    useEffect(() => {
        setGames(data.map(g => <DisplayGame key={g._id} game={g} {...props} />))
    }, [data, props])

    return <div className="ListGames">{games}</div>
}

export default ListGames