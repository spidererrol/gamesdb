import { createRef, Key, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import { PlayModeType } from "../../libs/types/PlayMode"
import { array2map, formap, isKnown, makeCloudItemsSettable, mapfilter, mapmap } from "../../libs/utils"
import Loading from "../bits/Loading"
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
import { CloudItem } from "../../libs/types/CloudItem"
import EditPlayMode from "./EditPlayMode"
import { VoteType } from "../../libs/types/Vote"
import { OwnerType } from "../../libs/types/Owner"
import { v4 } from 'uuid'

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

function EditMapItem<K, T>(getter: Map<K, T>, setter: React.Dispatch<React.SetStateAction<Map<K, T>>>, index: K, updater: (v: T) => void) {
    const newthing = new Map<K, T>(getter)
    const item = newthing.get(index)
    if (item !== undefined) {
        updater(item)
        newthing.set(index, item)
    }
    setter(newthing)
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
    const [tags, setTags] = makeCloudItemsSettable(game.tags, useCallback(t => { return { key: t, display: t } }, []))
    const [vote, setVote] = useState<string>("None")
    const [owned, setOwned] = useState<OwnershipInfo>({ isOwned: false, isInstalled: false, maxPrice: null })
    // const [dbplaymodes, setdbPlaymodes] = useState<PlayModeType[]>([])
    const [playmodesMap, setPlaymodesMap] = useState<Map<string, PlayModeType>>(new Map<string, PlayModeType>())
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
            props.api.game.playmodes(game._id).then(pms => setPlaymodesMap(array2map(pms, i => [i._id, i])))
    }, [props.api.game, game._id])

    const addPlaymode = useCallback((e) => {
        console.log("Add PM")
        let olddb = cloneMap(playmodesMap)
        let uid = v4()
        olddb.set(uid, {
            _id: uid,
            _isnew: true,
            name: "NEW",
            description: "",
            included: false,
            myVote: {
                vote: "None",
                vote_id: null
            } as VoteType,
            myOwner: {
                isOwned: false, isInstalled: false, maxPrice: null
            } as OwnerType,
        } as PlayModeType)
        setPlaymodesMap(olddb)
    }, [playmodesMap])

    const delPlaymode = useCallback((e, pmid) => {
        console.log("Del PM:" + pmid)
        let opms = cloneMap(playmodesMap)
        opms.delete(pmid)
        setPlaymodesMap(opms)
    }, [playmodesMap])

    const epmUpdateName = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => v.name = e.target.value)
    }, [playmodesMap])

    const epmUpdateVote = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => { v.myVote.vote = e.target.value; v.myVote.vote_id = null })
    }, [playmodesMap])

    const epmUpdateIncluded = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => v.included = e.target.checked)
    }, [playmodesMap])

    const epmUpdateOwnedState = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => {
            if (!isKnown(v.myOwner))
                v.myOwner = { isInstalled: false, isOwned: false, maxPrice: null } as OwnerType
            v.myOwner.isInstalled = (e.target.value === "Installed")
            v.myOwner.isOwned = (e.target.value !== "Unowned")
        })
    }, [playmodesMap])

    const epmUpdateOwnedPrice = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => {
            if (!isKnown(v.myOwner))
                v.myOwner = { isInstalled: false, isOwned: false, maxPrice: null } as OwnerType
            v.myOwner.maxPrice = Number.parseFloat(e.target.value)
        })
    }, [playmodesMap])

    const epmUpdateDescription = useCallback((e, pmid) => {
        EditMapItem(playmodesMap, setPlaymodesMap, pmid, v => v.description = e.target.value)
    }, [playmodesMap])

    useEffect(() => {
        let newplaymodes = mapmap(playmodesMap, (_k, pm) => <EditPlayMode
            key={pm._id}
            playmode={pm}
            nameUpdate={epmUpdateName}
            descriptionUpdate={epmUpdateDescription}
            voteUpdate={epmUpdateVote}
            includedUpdate={epmUpdateIncluded}
            ownedStateUpdate={epmUpdateOwnedState}
            ownedPriceUpdate={epmUpdateOwnedPrice}
            delAction={delPlaymode}
            {...props}
        />)
        newplaymodes.push(<div key="NEW" className="Edit PlayMode"><AddButton onClick={addPlaymode} /></div>)
        setPlayModes(newplaymodes)
    }, [addPlaymode, delPlaymode, epmUpdateDescription, epmUpdateIncluded, epmUpdateName, epmUpdateOwnedPrice, epmUpdateOwnedState, epmUpdateVote, game._id, playmodesMap, props])

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

    // const noop = useCallback((e, i?) => {
    //     e.preventDefault()
    //     console.log("NOOP")
    // }, [])

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

    const addTag = useCallback((newtag: string) => {
        console.log("Add:" + newtag)
        if (newtag.trim() !== "") {
            const newtags = new Map<Key, CloudItem>(tags)
            newtags.set(newtag, { key: newtag, display: newtag })
            setTags(newtags)
        }
        // game.tags.push(newtag)
    }, [setTags, tags])

    const delTag = useCallback((e, k: CloudItem) => {
        console.log("Del T:" + k.key)
        const newtags = new Map<Key, CloudItem>(tags)
        newtags.delete(k.key)
        setTags(newtags)
    }, [setTags, tags])

    const dumpcurrent = useCallback(e => {
        console.log("======================== save! ========================")
        console.table([{
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            vote: game.myVote?.vote,
            owned: game.myOwner?.isOwned,
            installed: game.myOwner?.isInstalled,
            maxPrice: game.myOwner?.maxPrice,
        }])
        formap(aliasRefs, (i, r) => {
            console.log(`A[${i}]:${r.current?.value}`)
        })
        console.table(mapmap(linkRefs, (i, r) => {
            return {
                index: i,
                name: r.current?.name?.value,
                url: r.current?.url?.value,
            }
        }))
        formap(tags, (tag, ci) => {
            console.log(`T:${tag}`)
        })
        console.table(mapmap(playmodesMap, (k, v) => {
            return {
                _isnew: v._isnew,
                name: v.name,
                description: v.description,
                included: v.included,
                isOwned: v.myOwner.isOwned,
                isInstalled: v.myOwner.isInstalled,
                maxPrice: v.myOwner.maxPrice,
                vote: v.myVote.vote,
            }
        }))
        console.log("============================ END =======================")
    }, [aliasRefs, game, linkRefs, playmodesMap, tags])

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
        <GenericEditCloud getItems={tags} addItem={addTag} delItem={delTag} {...props} />
        {/* TODO:Edit/Del/Add playmodes */}
        <div className="editplaymodes">{playmodes}</div>
        <hr />
        <input type="submit" value="save" onClick={dumpcurrent} />
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