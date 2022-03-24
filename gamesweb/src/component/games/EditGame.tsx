import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeType } from "../../libs/types/PlayMode"
import { isKnown, makeCloudItems, makeElements } from "../../libs/utils"
import GenericCloud from "../bits/GenericCloud"
import Loading from "../bits/Loading"
import OwnedIcon from "../bits/OwnedIcon"
import PlayMode from "./PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import VoteIcon from "../bits/VoteIcon"
import GameLinks from "./GameLinks"

interface EGProps extends GeneralProps {
}

function EditGame(props: EGProps): JSX.Element {
    const params = useParams()

    const [game, setGame] = useState<GameType>({
        name: "Loading...",
        aliases: [],
        tags: [],
    } as unknown as GameType)

    let aliases = makeElements(game.aliases, useCallback(a => <div key={a} className="alias">{a}</div>, []))
    let tags = makeCloudItems(game.tags, useCallback(t => { return { key: t, display: t } }, []))
    let [vote, setVote] = useState<string>("None")
    let [owned, setOwned] = useState<string>("None")
    let [price, setPrice] = useState<number>(0)
    let [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    let [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" />])

    useEffect(() => {
        props.api.game.get(params.gameid as string).then(g => setGame(g))
    }, [params.gameid, props.api.game])

    useEffect(() => {
        if (isKnown(game._id))
            props.api.game.playmodes(game._id).then(pms => setdbPlaymodes(pms))
    }, [props.api.game, game._id])
    useEffect(() => {
        setPlayModes(dbplaymodes.map(pm => <PlayMode key={pm._id} playmode={pm} gameid={game._id} {...props} />))
    }, [dbplaymodes, game._id, props])

    useEffect(() => {
        if (isKnown(game.myVote?.vote)) {
            setVote(game.myVote?.vote as string)
        } else {
            setVote("None")
        }
    }, [game])
    useEffect(() => {
        if (game.myOwner?.isInstalled) {
            setOwned("Installed")
        } else if (game.myOwner?.isOwned) {
            setOwned("Owned")
        } else {
            setOwned("Unowned")
            setPrice(game.myOwner?.maxPrice ?? 0)
        }
    }, [game.myOwner])

    return <fieldset className="game">
        <legend>{game.name}</legend>
        {aliases}
        <div className="prop playercount minPlayers">Min Players: {game.minPlayers ?? "unknown"}</div>
        <div className="prop playercount maxPlayers">Max Players: {game.maxPlayers ?? "unknown"}</div>
        <div className="prop vote">Vote: <VoteIcon vote={vote} />{vote}</div>
        <div className="prop owner">Owned: {owned === "Unowned" ? <></> : <OwnedIcon owned={owned} maxPrice={price} />}{owned === "Unowned" ? ` ≤ £${price.toFixed(2)}` : owned}</div>
        <GameLinks game={game} {...props} />
        <GenericCloud getItems={tags} {...props} />
        {playmodes}
    </fieldset>
}

export default EditGame