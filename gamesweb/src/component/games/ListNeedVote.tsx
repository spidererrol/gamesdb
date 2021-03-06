import { createRef, useCallback, useEffect, useState } from "react"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import LabelInput from "../bits/LabelInput"
import Loading from "../bits/Loading"
import Cards from "../cards/Cards"
import { GeneralProps } from "../props/GeneralProps"
import DisplayGame from "./DisplayGame"

function ListGames(props: GeneralProps) {
    const [data, setData] = useState<GameType[]>([])
    const [games, setGames] = useState<anyElementList>([<Loading key="loading" caller="ListGames/games" />])
    const refSearch = createRef<HTMLInputElement>()

    const gameDeleted = useCallback(() => {
        props.dbupdate("games")
    }, [props])

    useEffect(() => {
        props.api.game.needVote().then(games => setData(games))
    }, [props.api.game, props.dbupdates.games])

    useEffect(() => {
        console.log("Update games")
        setGames(data.map(g => <DisplayGame key={g._id} game={g} refresh={gameDeleted} {...props} />))
    }, [data, gameDeleted, props])

    const search = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: HTMLInputElement, preventDefault: Function }) => {
        e.preventDefault()
        if (e.target.value.trim() === "") {
            props.api.game.needVote().then(games => setData(games))
        } else {
            props.api.game.search(e.target.value).then(games => setData(games))
        }
    }, [props.api.game])

    const clear = useCallback((e) => {
        if (refSearch.current !== null) {
            refSearch.current.value = "" // Doesn't trigger onChange!
            search({ target: refSearch.current, preventDefault: () => null })
        }
    }, [refSearch, search])

    return <div className="ListGames">
        <Cards className="game_list">{games}</Cards>
    </div>
}

export default ListGames