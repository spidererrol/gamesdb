import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeType } from "../../libs/types/PlayMode"
import { isKnown, makeCloudItems, makeElements } from "../../libs/utils"
import GenericCloud from "../bits/GenericCloud"
import Loading from "../bits/Loading"
import OwnedIcon from "../bits/OwnedIcon"
import { GeneralProps } from "../props/GeneralProps"
import VoteIcon from "../bits/VoteIcon"
import GameLinks from "./GameLinks"
import PlayMode from "./PlayMode"

interface DGProps extends GeneralProps {
    game: GameType
}

function DisplayGame(props: DGProps): JSX.Element {
    let aliases = makeElements(props.game.aliases, useCallback(a => <div key={a} className="alias">{a}</div>, []))
    let tags = makeCloudItems(props.game.tags, useCallback(t => { return { key: t, display: t } }, []))
    let [vote, setVote] = useState<string>("None")
    let [owned, setOwned] = useState<string>("None")
    let [price, setPrice] = useState<number>(0)
    let [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    let [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" />])

    useEffect(() => {
        props.api.game.playmodes(props.game._id).then(pms => setdbPlaymodes(pms))
    }, [props.api.game, props.game._id])
    useEffect(() => {
        setPlayModes(dbplaymodes.map(pm => <PlayMode key={pm._id} playmode={pm} gameid={props.game._id} {...props} />))
    }, [dbplaymodes, props])

    useEffect(() => {
        if (isKnown(props.game.myVote?.vote)) {
            setVote(props.game.myVote?.vote as string)
        } else {
            setVote("None")
        }
    }, [props.game])
    useEffect(() => {
        if (props.game.myOwner?.isInstalled) {
            setOwned("Installed")
        } else if (props.game.myOwner?.isOwned) {
            setOwned("Owned")
        } else {
            setOwned("Unowned")
            setPrice(props.game.myOwner?.maxPrice ?? 0)
        }
    }, [props.game.myOwner])

    return <fieldset className="game">
        <legend>{props.game.name}<Link to={props.game._id + "/edit"} ><FontAwesomeIcon className="icon editicon" icon={faPenToSquare} /></Link></legend>
        {aliases}
        <div className="prop playercount minPlayers">Min Players: {props.game.minPlayers ?? "unknown"}</div>
        <div className="prop playercount maxPlayers">Max Players: {props.game.maxPlayers ?? "unknown"}</div>
        <div className="prop vote">Vote: <VoteIcon vote={vote} /></div>
        <div className="prop owner">Owned: {owned === "Unowned" ? <></> : <OwnedIcon owned={owned} maxPrice={price} />}{owned === "Unowned" ? ` ≤ £${price.toFixed(2)}` : owned}</div>
        <GameLinks {...props} />
        <GenericCloud getItems={tags} {...props} />
        {playmodes}
    </fieldset>
}

export default DisplayGame