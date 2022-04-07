import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { requestGame } from "../../libs/AddEditGameHelpers"
import { VoteNames } from "../../libs/api/game"
import { GameType } from "../../libs/types/Game"
import { anyElement, anyElementList } from "../../libs/types/helpers"
import { newNLMap, NLMap } from "../../libs/types/ILink"
import { PlayModeType } from "../../libs/types/PlayMode"
import { formap, isKnown, makeCloudItems, newNSMap, NSMap, OwnershipInfo } from "../../libs/utils"
import AddButton from "../bits/AddButton"
import GenericCloud from "../bits/GenericCloud"
import GenericEditCloud from "../bits/GenericEditCloud"
import Loading from "../bits/Loading"
import OwnedEdit from "../bits/OwnedEdit"
import TagCloud from "../bits/TagCloud"
import UpdateMark, { UpdateState } from "../bits/UpdateMark"
import VoteEdit, { VEChangeHandler } from "../bits/VoteEdit"
import { GeneralProps } from "../props/GeneralProps"
import EditPlayMode from "./EditPlayMode"
import GameLinks from "./GameLinks"
import PlayMode from "./PlayMode"
import PlayModeVotes from "./PlayModeVotes"

interface GVProps extends GeneralProps { }

function GameVotes(props: GVProps) {
    const params = useParams()

    const [game, setGame] = useState<GameType>({
        name: "Loading...",
        aliases: [],
        tags: [],
    } as unknown as GameType)
    const [aliasElements, setAliasElements] = useState<anyElementList>([<Loading key="loading" caller="EditGame/Aliases" />])
    const [aliases, setAliases] = useState<NSMap>(newNSMap())
    const [vote, setVote] = useState<string>("None")
    const [owned, setOwned] = useState<OwnershipInfo>({ isOwned: false, isInstalled: false, maxPrice: null })
    const tags = makeCloudItems(game.tags, useCallback(t => { return { key: t, display: t } }, []))
    const [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    const [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" caller="EditGame/Playmodes" />])
    const [getUpdatePlaymodes, setUpdatePlaymodes] = useState<boolean>(true)
    const [getVoteState,setVoteState] = useState<UpdateState>(UpdateState.None)
    const [getOwnedState,setOwnedState] = useState<UpdateState>(UpdateState.None)
    const [getPriceState,setPriceState] = useState<UpdateState>(UpdateState.None)
    // const [getVoteUpdated, setVoteUpdated] = useState<anyElement>(<></>)
    // const [getOwnedUpdated, setOwnedUpdated] = useState<anyElement>(<></>) // Can't easily seperate out the parts

    useEffect(() => {
        if (params.gameid !== undefined)
            requestGame(props.api.game, params.gameid, setGame)
    }, [params.gameid, props.api.game, props.dbupdates.games])

    useEffect(() => {
        let els: anyElementList = []
        // let ars = newNRMap()
        var itr = aliases.entries()
        // let blank = false
        for (let i = 0; i < aliases.size; i++) {
            let [k, v] = itr.next().value
            // if (v === "")
            //     blank = true
            // let newRef = createRef<HTMLInputElement>()
            // ars.set(k, newRef)
            els.push(<div key={k} className="alias">{v}</div>)
        }
        // setAliasRefs(ars)
        setAliasElements(els)
        // setAddDisabled(haveBlank(ars)) //NOTE: If I turn this line on, it enables the add button (I think because all refs are undefined?)
        // setAddDisabled(blank)
    }, [aliases])

    useEffect(() => {
        setOwned(game.myOwner ?? { isOwned: false, isInstalled: false, maxPrice: null })
        // if (game.myOwner?.isInstalled) {
        //     setOwned("Installed")
        // } else if (game.myOwner?.isOwned) {
        //     setOwned("Owned")
        // } else {
        //     setOwned("Unowned")
        //     setPrice(game.myOwner?.maxPrice ?? 0)
        // }
    }, [game.myOwner])

    useEffect(() => {
        let out = newNSMap()
        for (let i = 0; i < game.aliases.length; i++) {
            out.set(i, game.aliases[i])
        }
        setAliases(out)
    }, [game.aliases])

    useEffect(() => {
        if (isKnown(game._id) && getUpdatePlaymodes)
            props.api.game.playmodes(game._id).then(pms => setdbPlaymodes(pms)).then(() => setUpdatePlaymodes(false))
    }, [props.api.game, game._id, getUpdatePlaymodes])

    useEffect(() => {
        if (isKnown(game.myVote?.vote)) {
            setVote(game.myVote?.vote as string)
        } else {
            setVote("None")
        }
    }, [game])

    const noop = useCallback((e) => {
        if (e.preventDefault)
            e.preventDefault()
    }, [])

    //FIXME: implement update hooks
    const updateVote = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setVoteState(UpdateState.Updating)
        props.api.game.vote(game._id, e.target.value as VoteNames).then(() => props.dbupdate("games")).then(() => setVoteState(UpdateState.Updated))
    }, [game._id, props])
    const updateOwnedState = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setOwnedState(UpdateState.Updating)
        props.api.game.ownership(game._id, {
            isOwned: e.target.value !== "Unowned",
            isInstalled: e.target.value === "Installed",
        }).then(() => props.dbupdate("games")).then(() => setOwnedState(UpdateState.Updated))
    }, [game._id, props])
    const updatePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceState(UpdateState.Updating)
        props.api.game.ownership(game._id, {
            maxPrice: Number.parseFloat(e.target.value)
        }).then(() => props.dbupdate("games")).then(() => setPriceState(UpdateState.Updated))
    }, [game._id, props])
    const updatePMVote = noop
    const updatePMOwnedState = noop
    const updatePMOwnedPrice = noop

    useEffect(() => {
        setPlayModes(dbplaymodes.map(pm => <PlayModeVotes key={pm._id} playmode={pm} ownedStateUpdate={updatePMOwnedState} ownedPriceUpdate={updatePMOwnedPrice} voteUpdate={updatePMVote} />))
    }, [dbplaymodes, game._id, props, updatePMOwnedPrice, updatePMOwnedState, updatePMVote])

    return <fieldset className="game GameVotes">
        <legend>
            {game.name}
        </legend>
        {aliasElements}
        <div className="prop playercount minPlayers">Min Players: {game.minPlayers ?? "unknown"}</div>
        <div className="prop playercount maxPlayers">Max Players: {game.maxPlayers ?? "unknown"}</div>
        <div className="prop vote">Vote: <VoteEdit vote={vote} setter={updateVote} state={getVoteState} /></div>
        <div className="prop owner">Status: <OwnedEdit {...owned} selectSetter={updateOwnedState} priceSetter={updatePrice} ownedUpdate={getOwnedState} priceUpdate={getPriceState} /></div>
        <GameLinks game={game} {...props} />
        Tags: <GenericCloud getItems={tags} {...props} />
        <div className="voteplaymodes">
            {playmodes}
        </div>
    </fieldset>
}

export default GameVotes