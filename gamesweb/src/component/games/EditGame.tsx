import { createRef, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeType } from "../../libs/types/PlayMode"
import { isKnown, makeCloudItems } from "../../libs/utils"
import GenericCloud from "../bits/GenericCloud"
import Loading from "../bits/Loading"
import OwnedIcon from "../bits/OwnedIcon"
import PlayMode from "./PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import VoteIcon from "../bits/VoteIcon"
import GameLinks from "./GameLinks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import AliasInput from "../bits/AliasInput"

interface EGProps extends GeneralProps {
}

type InputRef = React.RefObject<HTMLInputElement>

type NMap<T> = Map<number, T>

type NSMap = NMap<string>

type NRMap = NMap<InputRef>

function newNSMap(init?: any) {
    return new Map<number, string>(init)
}

function newNRMap(init?: any) {
    return new Map<number, InputRef>(init)
}

function dumpArray(ina: string[]): string {
    let outa: string[] = []
    for (const ar of ina) {
        outa.push(ar)
    }
    return "[" + outa.map(a => `"${a}"`).join(",") + "]"
}

function mapmap<K, V, R>(input: Map<K, V>, mapper: (k: K, v: V) => R): R[] {
    let ret: R[] = []
    let itr = input.entries()
    for (let i = 0; i < input.size; i++) {
        let [k, v] = itr.next().value
        ret.push(mapper(k, v))
    }
    return ret
}

function mapfilter<K, V>(input: Map<K, V>, filter: (k: K, v: V) => boolean): Map<K, V> {
    let ret = new Map<K, V>()
    let itr = input.entries()
    for (let i = 0; i < input.size; i++) {
        let [k, v] = itr.next().value
        if (filter(k, v))
            ret.set(k, v)
    }
    return ret
}

function dumpRefs(ars: NRMap): string {
    // return dumpArray(ars.map(ar => ar.current?.value as string))
    return dumpArray(mapmap(ars, (k, v) => `${k}:"${v.current?.value as string}"`))
}

function cloneMap<K, V>(input: Map<K, V>): Map<K, V> {
    return new Map<K, V>(input)
}

function haveBlank(refs: NRMap) {
    return mapfilter(refs, (_k, ar) => ar.current?.value === "").size > 0
}

function EditGame(props: EGProps): JSX.Element {
    const params = useParams()

    const [game, setGame] = useState<GameType>({
        name: "Loading...",
        aliases: [],
        tags: [],
    } as unknown as GameType)

    // const aliasElements = makeElements(game.aliases, useCallback(a => <div key={a} className="alias"><input defaultValue={a} /></div>, []))
    const [aliasElements, setAliasElements] = useState<anyElementList>([<Loading key="loading" />])
    const [aliases, setAliases] = useState<NSMap>(newNSMap())
    const [aliasRefs, setAliasRefs] = useState<NRMap>(newNRMap())
    const tags = makeCloudItems(game.tags, useCallback(t => { return { key: t, display: t } }, []))
    const [vote, setVote] = useState<string>("None")
    const [owned, setOwned] = useState<string>("None")
    const [price, setPrice] = useState<number>(0)
    const [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    const [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" />])
    const [debug, setDebug] = useState<any>([])
    const refName = createRef<HTMLInputElement>()
    const [deli, setDeli] = useState<number>()
    const [lastdeli, setLastDeli] = useState<number>()
    const [add_disabled, setAddDisabled] = useState<boolean>(false)
    let nexti = useRef(0)

    useEffect(() => {
        if (isKnown(deli))
            setLastDeli(deli)
    }, [deli])

    const delAlias = useCallback((e, data) => {
        e.preventDefault()
        let i = data as number
        console.log(`Delete ${i}`)
        setDeli(i)
    }, [])

    const updateAlias = useCallback((e, i) => {
        if (e.target.value === "") {
            setAddDisabled(true)
        } else {
            setAddDisabled(false)
        }
        let newaliases = cloneMap(aliases)
        newaliases.set(i, e.target.value)
        setAliases(newaliases)
    }, [aliases])

    useEffect(() => {
        let els: anyElementList = []
        let ars = newNRMap()
        var itr = aliases.entries()
        let blank = false
        for (let i = 0; i < aliases.size; i++) {
            let [k, v] = itr.next().value
            if (v==="")
                blank = true
            let newRef = createRef<HTMLInputElement>()
            ars.set(k, newRef)
            els.push(<AliasInput i={k} value={v} ref={newRef} onDelClick={delAlias} onInputChange={updateAlias} />)
        }
        setAliasRefs(ars)
        setAliasElements(els)
        // setAddDisabled(haveBlank(ars)) //FIXME: If I turn this on, it enables the add button (I think because all refs are undefined)
        setAddDisabled(blank)
    }, [aliases, delAlias, updateAlias])

    useEffect(() => {
        if (isKnown(deli)) {
            let i = deli as number
            console.log(`Deleting ${i}`)
            let newAliases = cloneMap(aliases)
            let newRefs = cloneMap(aliasRefs)
            newAliases.delete(i)
            newRefs.delete(i)
            setAliases(newAliases)
            setAliasRefs(newRefs)

            // let aes = [...aliasElements]
            // let ars = [...aliasRefs]
            // // game.aliases.splice(i, 1)
            // // setDebug("del:" + dumpRefsArray(ars) + "\n" + dumpRefsArray(aliasRefs))
            // aes.splice(i, 1)
            // ars.splice(i, 1)
            // setAliasElements(aes)
            // setAliasRefs(ars)
            setDeli(undefined)
            setAddDisabled(haveBlank(newRefs))
        }
    }, [aliasRefs, aliases, deli])

    useEffect(() => {
        setDebug("Change:" + dumpRefs(aliasRefs))
        // let outa: string[] = []
        // for (const ar of aliasRefs) {
        //     outa.push(ar.current?.value as string)
        // }
        // setDebug(outa.map(a => `[${a}]`).join(","))
    }, [aliasRefs])

    const addAlias = useCallback((e) => {
        e.preventDefault()
        if (haveBlank(aliasRefs))
            return
        let newalias = cloneMap(aliases)
        let is = mapmap(newalias, (k, v) => k)
        let nexti = is.reduce((p, c) => p > c ? p : c, 0)
        nexti++
        newalias.set(nexti, "")
        setAliases(newalias)
        setAddDisabled(true)
    }, [aliasRefs, aliases])

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

    useEffect(() => {
        let out = newNSMap()
        for (let i = 0; i < game.aliases.length; i++) {
            out.set(i, game.aliases[i])
        }
        setAliases(out)
    }, [game.aliases])

    const save = useCallback((e) => {
        e.preventDefault()
    }, [])

    // Edit boxes get stuck so don't load them until ready...
    if (!isKnown(game._id))
        return <Loading />

    return <fieldset className="game">
        <legend>
            <input type="text" ref={refName} defaultValue={game.name} />
        </legend>
        {aliasElements}
        <div className="alias"><button disabled={add_disabled} className="addAlias" onClick={addAlias}><FontAwesomeIcon icon={faSquarePlus} /></button></div>
        <div className="prop playercount minPlayers">Min Players: {game.minPlayers ?? "unknown"}</div>
        <div className="prop playercount maxPlayers">Max Players: {game.maxPlayers ?? "unknown"}</div>
        <div className="prop vote">Vote: <VoteIcon vote={vote} />{vote}</div>
        <div className="prop owner">Owned: {owned === "Unowned" ? <></> : <OwnedIcon owned={owned} maxPrice={price} />}{owned === "Unowned" ? ` ≤ £${price.toFixed(2)}` : owned}</div>
        <GameLinks game={game} {...props} />
        <GenericCloud getItems={tags} {...props} />
        {playmodes}
        <hr />
        <input type="submit" value="save" onClick={save} />
        <pre>
            {nexti.current}
            |
            {debug}
            |
            {lastdeli ?? "unknown"}
        </pre>
    </fieldset>
}

export default EditGame