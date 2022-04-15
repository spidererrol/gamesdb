import { createRef, useCallback, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { GroupType } from "../../libs/types/Group"
import { GeneralProps } from "../props/GeneralProps"
import GroupGame from "../GroupGame"
import Loading from "../bits/Loading"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import LabelInput from "../bits/LabelInput"
import { GameType } from "../../libs/types/Game"
import { anyElementList } from "../../libs/types/helpers"
import AddButton from "../bits/AddButton"
import { idString } from "../../libs/utils"

function hasGame(group: GroupType, game: GameType | string): boolean {
    return group.games.map(g => idString(g)).includes(idString(game))
}

function GroupPage(props: GeneralProps) {
    const params = useParams()
    const [group, setGroup] = useState<GroupType>({ name: "pending" } as GroupType)
    const [members, setMembers] = useState<any[]>([<Loading key="loading" caller="GroupPage/members" />])
    const [games, setGames] = useState<any[]>([<Loading key="loading" caller="GroupPage/games" />])
    const [data, setData] = useState<GameType[]>()
    const [getSearchGameElems, setSearchGameElems] = useState<anyElementList>()
    const [getSearch, setSearch] = useState<string>("")

    const refSearch = createRef<HTMLInputElement>()

    useEffect(() => {
        if (params.groupid !== undefined)
            props.api.group.get(params.groupid).then((g) => setGroup(() => g)).catch((reason) => setGroup(() => { return { name: "Error: " + reason } as GroupType }))
    }, [params.groupid, props.api.group])
    useEffect(() => {
        let out: any[] = []
        if (group.members !== undefined) {
            for (const member of group.members) {
                out.push(<div className="member" key={member._id.toString()}>{member.displayName}</div>)
            }
        }
        setMembers(() => out)
    }, [group.members])

    const removeGame = useCallback((e, gameid: string) => {
        e.preventDefault()
        props.api.group.remove(group._id, gameid).then(() => setSearch(getSearch)).then(() => props.dbupdate("games"))
    }, [getSearch, group._id, props])

    const addGame = useCallback((e, gameid: string) => {
        e.preventDefault()
        props.api.group.add(group._id, gameid).then(() => setSearch(getSearch)).then(() => props.dbupdate("games"))
    }, [getSearch, group._id, props])

    useEffect(() => {
        let out: any[] = []
        if (group.games !== undefined) {
            for (const game of group.games) { //.sort((a, b) => a.name.localeCompare(b.name))
                out.push(<GroupGame key={idString(game)} gameid={idString(game) as string} groupid={idString(group) as string} clickRemove={removeGame} {...props} />)
            }
        }
        setGames(out)
    }, [group.games, params.groupid, props, removeGame, props.dbupdates.games, group])

    useEffect(() => {
        if (data === undefined)
            setSearchGameElems([<div key="NULL">(search above)</div>])
        else if (data.length > 0)
            setSearchGameElems(data.map(g => <div className={"search_result" + (hasGame(group, g) ? " disabled" : "")} key={g._id}>{g.name}<AddButton disabled={hasGame(group, g)} onClick={addGame} data={g._id} /></div>))
        else
            setSearchGameElems([<div key="NULL">(no matches)</div>])
    }, [addGame, data, group])

    useEffect(() => {
        if (getSearch.trim() === "") {
            setData(undefined)
        } else {
            props.api.game.search(getSearch).then(games => setData(games))
        }
    }, [getSearch, props.api.game])

    const search = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: HTMLInputElement, preventDefault: Function }) => {
        e.preventDefault()
        setSearch(e.target.value)
    }, [])

    const clear = useCallback((e) => {
        if (refSearch.current !== null) {
            refSearch.current.value = "" // Doesn't trigger onChange!
            search({ target: refSearch.current, preventDefault: () => null })
        }
    }, [refSearch, search])

    return (<div className="ViewGroup GroupPage">
        <h1>{group.name}<NavLink className="edit_icon" to={`/groups/${group._id}/edit`}><FontAwesomeIcon icon={faPenToSquare} /></NavLink></h1>
        <p className="public_private">{group.private ? "private" : "public"}</p>
        <p className="description">{group.description}</p>
        <br />
        <div className="memberslist"><div className="label">Members:</div>{members}</div>
        <fieldset>
            <legend>Games:</legend>
            <div className="gameslist">{games}</div>
        </fieldset>
        <fieldset className="add_game">
            <legend>Add Game:</legend>
            <div className="game_search">
                <LabelInput ref={refSearch} type="text" label="Search" onChange={search} onClear={clear} />
            </div>
            <div className="results">
                {getSearchGameElems}
            </div>
        </fieldset>
    </div>)
}


export default GroupPage