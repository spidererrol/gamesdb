import { createRef, useCallback, useEffect, useState } from "react"
import { GameType } from "../../libs/types/Game"
import { isKnown, makeCloudItems, makeElements } from "../../libs/utils"
import GenericCloud from "../bits/GenericCloud"
import LabelSelect, { OptionInfo } from "../bits/LabelSelect"
import OwnedIcon from "../OwnedIcon"
import { GeneralProps } from "../props/GeneralProps"
import VoteIcon from "../VoteIcon"
import GameLinks from "./GameLinks"

interface DGProps extends GeneralProps {
    game: GameType
}

function DisplayGame(props: DGProps): JSX.Element {
    let aliases = makeElements(props.game.aliases, useCallback(a => <div key={a} className="alias">{a}</div>, []))
    let tags = makeCloudItems(props.game.tags, useCallback(t => { return { key: t, display: t } }, []))
    let [vote, setVote] = useState<string>("None")
    useEffect(() => {
        if (isKnown(props.game.myVote?.vote)) {
            setVote(props.game.myVote?.vote as string)
        } else {
            setVote("None")
        }
    }, [props.game])
    let [owned, setOwned] = useState<string>("None")
    let [price, setPrice] = useState<number>(0)
    useEffect(() => {
        if (props.game.myOwner?.isInstalled) {
            setOwned("Installed")
        } else if (props.game.myOwner?.isOwned) {
            setOwned("Owned")
        } else {
            setOwned("Unowned")
            setPrice(props.game.myOwner?.maxPrice??0)
        }
    }, [props.game.myOwner])

    return <fieldset className="game">
        <legend>{props.game.name}</legend>
        {aliases}
        <div className="prop playercount minPlayers">Min Players: {props.game.minPlayers ?? "unknown"}</div>
        <div className="prop playercount maxPlayers">Max Players: {props.game.maxPlayers ?? "unknown"}</div>
        <div className="prop vote">Vote: <VoteIcon vote={vote} />{vote}</div>
        <div className="prop owner">Owned: {owned==="Unowned"?<></>:<OwnedIcon owned={owned} maxPrice={price} />}{owned === "Unowned"?` ≤ ${price}`:owned}</div>
        <GameLinks {...props} />
        <GenericCloud getItems={tags} {...props} />
        TODO: Playmodes
    </fieldset>
}

export default DisplayGame