import { createRef, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeType } from "../../libs/types/PlayMode"
import { isKnown, makeCloudItems } from "../../libs/utils"
import Loading from "../bits/Loading"
import PlayMode from "./PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons"
import AliasInput from "../bits/AliasInput"
import VoteEdit from "../bits/VoteEdit"
import OwnedEdit from "../bits/OwnedEdit"
import { NLMap, newNLMap, ILink } from "../../libs/types/ILink"
import { NMap } from "../../libs/types/NMap"
import { NRMap, newNRMap } from "../../libs/types/InputRef"
import EditGameLink, { EGLRef } from "./EditGameLink"
import AddButton from "../bits/AddButton"
import GenericEditCloud from "../bits/GenericEditCloud"

interface EGProps extends GeneralProps {
}

type NSMap = NMap<string>

function newNSMap(init?: any) {
    return new Map<number, string>(init)
}

// type NEMap = NMap<anyElement>

// function newNEMap(init?: any) {
//     return new Map<number, string>(init)
// }

function dumpArray(ina: string[]): string {
    let outa: string[] = []
    for (const ar of ina) {
        outa.push(ar)
    }
    return "[" + outa.map(a => `${a}`).join(",") + "]"
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
    return dumpArray(mapmap(ars, (k, v) => `${k}:${v.current?.value as string}`))
}

function cloneMap<K, V>(input: Map<K, V>): Map<K, V> {
    return new Map<K, V>(input)
}

function haveBlank(refs: NRMap) {
    return mapfilter(refs, (_k, ar) => ar.current?.value === "").size > 0
}

interface OwnershipInfo {
    isOwned: boolean | null
    isInstalled: boolean | null
    maxPrice: number | null
}

function formap<K, V>(map: Map<K, V>, func: (k: K, v: V) => void): void {
    const itr = map.entries()
    for (let i = 0; i < map.size; i++) {
        let [k, v] = itr.next().value
        func(k, v)
    }
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
    const [owned, setOwned] = useState<OwnershipInfo>({ isOwned: false, isInstalled: false, maxPrice: null })
    // const [price, setPrice] = useState<number>(0)
    const [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    const [playmodes, setPlayModes] = useState<anyElementList>([<Loading key="loading" />])
    const [debug, setDebug] = useState<any>([])
    const [deli, setDeli] = useState<number>()
    const [lastdeli, setLastDeli] = useState<number>()
    const [add_disabled, setAddDisabled] = useState<boolean>(false)
    const refName = createRef<HTMLInputElement>()
    const refMinPlayers = createRef<HTMLInputElement>()
    const refMaxPlayers = createRef<HTMLInputElement>()
    const [links, setLinks] = useState<NLMap>(newNLMap())
    const [linkRefs, setLinkRefs] = useState<NRMap<EGLRef>>(newNRMap())
    // const [linkUrlRefs, setLinkUrlRefs] = useState<NRMap>(newNRMap())
    const [linkElements, setLinkElements] = useState<anyElementList>()
    let nexti = useRef(0)

    useEffect(() => {
        let out = newNLMap()
        let pos = 0
        for (const link in game.links) {
            let i = pos
            out.set(i, { name: link, url: game.links[link] })
            pos++
        }
        setLinks(out)
    }, [game.links])

    const delLink = useCallback((_event, data) => {
        const i = data as number
        const newlinks = newNLMap(links)
        newlinks.delete(i)
        setLinks(newlinks)
    }, [links])

    const addLink = useCallback((_event) => {
        const newlinks = newNLMap(links)
        let nexti = 0
        formap(newlinks, (i, _v) => {
            if (i >= nexti)
                nexti = i + 1
        })
        newlinks.set(nexti, { name: "New", url: "https://" })
        setLinks(newlinks)
    }, [links])

    const updateLink = useCallback((e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        const newlinks = newNLMap(links)
        // const nameRef = linkNameRefs.get(i) as InputRef
        // const urlRef = linkUrlRefs.get(i) as InputRef
        // const linkRef = linkRefs.get(i) as React.RefObject<EGLRef>
        let newlink = newlinks.get(i) as ILink
        // console.log(e.target.name + "=>" + e.target.value)
        (newlink as any)[e.target.name] = e.target.value
        // let newlink = {
        //     name: linkRef.current?.name?.value ?? "",
        //     url: linkRef.current?.url?.value ?? ""
        // }
        newlinks.set(i, newlink)
        setLinks(newlinks)
    }, [links])

    useEffect(() => {
        const newLinkRefs = newNRMap<EGLRef>()
        // const newUrlRefs = newNRMap()
        const newEls: anyElementList = []
        formap(links, (i, link) => {
            const linkRef = createRef<EGLRef>()
            // const nameRef = createRef<HTMLInputElement>()
            // const urlRef = createRef<HTMLInputElement>()
            // newNameRefs.set(i, nameRef)
            // newUrlRefs.set(i, urlRef)
            newLinkRefs.set(i, linkRef)
            newEls.push(<EditGameLink key={i} uid={i} name={link.name} url={link.url} delAction={delLink} updateAction={updateLink} ref={linkRef} />)
        })
        setLinkRefs(newLinkRefs)
        // setLinkNameRefs(newNameRefs)
        // setLinkUrlRefs(newUrlRefs)
        setLinkElements(newEls)
    }, [delLink, links, updateLink])

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
            if (v === "")
                blank = true
            let newRef = createRef<HTMLInputElement>()
            ars.set(k, newRef)
            els.push(<AliasInput key={k} i={k} value={v} ref={newRef} onDelClick={delAlias} onInputChange={updateAlias} />)
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

    const noop = useCallback((e, i?) => {
        e.preventDefault()
        console.log("NOOP")
    }, [])

    const updateVote = useCallback((e) => {
        setVote(e.target.value)
    }, [])

    const updateOwnedState = useCallback((e) => {
        let newowned = { ...owned }
        if (e.target.value === "Installed") {
            newowned.isInstalled = true
            newowned.isOwned = true
        } else if (e.target.value === "Owned") {
            newowned.isInstalled = false
            newowned.isOwned = true
        } else {
            newowned.isInstalled = false
            newowned.isOwned = false
        }
        setOwned(newowned)
    }, [owned])

    const updatePrice = useCallback((e) => {
        let newowned = { ...owned }
        if (e.target.value === "") {
            newowned.maxPrice = null
        } else {
            newowned.maxPrice = Number.parseFloat(e.target.value)
        }
        setOwned(newowned)
    }, [owned])

    const save = useCallback(e => {
        console.log("save!")
        formap(aliasRefs, (i, r) => {
            console.log(`A[${i}]:${r.current?.value}`)
        })
        // formap(linkNameRefs,(i,r)=>{
        //     console.log("N:" + r.current?.value)
        // })
        formap(linkRefs, (i, r) => {
            console.log(`N[${i}]:${r.current?.name?.value}`)
            console.log(`U[${i}]:${r.current?.url?.value}`)
        })
    }, [aliasRefs, linkRefs])

    // Edit boxes get stuck so don't load them until ready...
    if (!isKnown(game._id))
        return <Loading />

    return <fieldset className="game">
        <legend>
            <input type="text" ref={refName} defaultValue={game.name} />
        </legend>
        {aliasElements}
        <div className="alias"><button disabled={add_disabled} className="addAlias" onClick={addAlias}><FontAwesomeIcon icon={faSquarePlus} /></button></div>
        <div className="prop playercount minPlayers">Min Players: <input type="number" min={0} max={100} ref={refMinPlayers} defaultValue={game.minPlayers ?? ""} placeholder="unknown" /></div>
        <div className="prop playercount maxPlayers">Max Players: <input type="number" min={0} max={100} ref={refMaxPlayers} defaultValue={game.maxPlayers ?? ""} placeholder="unknown" /></div>
        <div className="prop vote">Vote: <VoteEdit vote={vote} setter={updateVote} /></div>
        <div className="prop owner">Owned: <OwnedEdit {...owned} selectSetter={updateOwnedState} priceSetter={updatePrice} /></div>
        <div className="links">
            {linkElements}
            <div className="linkcontainer">
                <AddButton onClick={addLink} />
            </div>
        </div>
        {/* TODO:EditCloud (only add & remove items - no edit) */}
        <GenericEditCloud getItems={tags} delItem={noop} addItem={noop} {...props} />
        {/* TODO:Edit/Del/Add playmodes */}
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