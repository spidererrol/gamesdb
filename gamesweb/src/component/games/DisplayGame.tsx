import { useCallback, useEffect, useState } from "react"
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
import DelButton from "../bits/DelButton"
import UnDelButton from "../bits/UnDelButton"
import CancelButton from "../bits/CancelButton"
import GameVoteButton from "../bits/GameVoteButton"
import EditGameButton from "../bits/EditGameButton"
import Card from "../cards/Card"

interface DGProps extends GeneralProps {
    game: GameType
    refresh: () => void
}

function DisplayGame(props: DGProps): JSX.Element {
    let aliases = makeElements(props.game.aliases, useCallback(a => <div key={a} className="alias">{a}</div>, []))
    let tags = makeCloudItems(props.game.tags, useCallback(t => { return { key: t, display: t } }, []))
    let [vote, setVote] = useState<string>("None")
    let [owned, setOwned] = useState<string>("None")
    let [price, setPrice] = useState<number>(0)
    let [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    let [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" caller="DisplayGame/playmodes" />])
    let [classNames, setClassNames] = useState<string>("game DisplayGame")

    useEffect(() => {
        props.api.game.playmodes(props.game._id).then(pms => setdbPlaymodes(pms))
    }, [props.api.game, props.game._id])
    useEffect(() => {
        setPlayModes(dbplaymodes.map(pm => <PlayMode key={pm._id} playmode={pm} {...props} />))
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

    const delete1 = useCallback((e) => {
        e.preventDefault()
        setClassNames("game DisplayGame deleted")
    }, [])

    const delete2 = useCallback((e) => {
        e.preventDefault()
        props.api.game.del(props.game).then(() => props.refresh())
    }, [props])

    const undelete = useCallback((e) => {
        e.preventDefault()
        setClassNames("game DisplayGame")
    }, [])

    // const noop = useCallback((e) => {
    //     e.preventDefault()
    // }, [])

    return <Card
        className={classNames}
        titleButtons={[<EditGameButton {...props} />, <GameVoteButton {...props} />, <DelButton onClick={delete1} data="" />]}
        header={props.game.name}
        {...props}
    >
        <>
            {aliases}
            <div className="prop playercount minPlayers">Min Players: {props.game.minPlayers ?? "unknown"}</div>
            <div className="prop playercount maxPlayers">Max Players: {props.game.maxPlayers ?? "unknown"}</div>
            <div className="prop vote">Vote: <VoteIcon vote={vote} /></div>
            <div className="prop owner">Status: {owned === "Unowned" ? <></> : <OwnedIcon owned={owned} maxPrice={price} />}{owned === "Unowned" ? ` ≤ £${price.toFixed(2)}` : owned}</div>
            <GameLinks {...props} />
            <GenericCloud getItems={tags} {...props} />
            {playmodes}
            <div className="cover">
                <span className="with_bg">
                    {/* <LabelInput label="Really Delete?" type="checkbox" onChange={delete2} defaultChecked={false} /> */}
                    Confirm or Cancel
                    <br />
                    <DelButton onClick={delete2} data="" title="Really Delete" /><CancelButton onClick={undelete} data="" title="Cancel" />
                </span>
                <UnDelButton onClick={undelete} data="" />
            </div>
        </>
    </Card>
}

export default DisplayGame