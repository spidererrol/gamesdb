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

    const search = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: HTMLInputElement | { value: string }, preventDefault: Function }) => {
        e.preventDefault()
        if (e.target.value.trim() === "") {
            props.api.game.getAll().then(games => setData(games))
        } else {
            props.api.game.search(e.target.value).then(games => setData(games))
        }
    }, [props.api.game])

    const gameDeleted = useCallback(() => {
        // Can't clear the search field hear as I end up with a recursive loop :(
        props.dbupdate("games")
    }, [props])

    useEffect(() => {
        console.log("Update games")
        setGames(data.map(g => <DisplayGame key={g._id} game={g} refresh={gameDeleted} {...props} />))
    }, [data, gameDeleted, props])

    const clear = useCallback((e?: any) => {
        if (refSearch.current !== null) {
            refSearch.current.value = "" // Doesn't trigger onChange!
            search({ target: refSearch.current, preventDefault: () => null })
        }
    }, [refSearch, search])

    useEffect(() => {
        // props.api.game.getAll().then(games => setData(games))
        search({ target: { value: "" }, preventDefault: () => null })
    }, [props.api.game, props.dbupdates.games, search])

    return <div className="ListGames">
        <LabelInput ref={refSearch} type="text" label="Search" placeholder="(all)" onChange={search} onClear={clear} />
        <Cards className="game_list">{games}</Cards>
    </div>
}

export default ListGames