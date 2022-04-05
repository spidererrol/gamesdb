import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { GroupType } from "../../libs/types/Group"
import { GeneralProps } from "../props/GeneralProps"
import GroupGame from "../GroupGame"
import Loading from "../bits/Loading"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function GroupPage(props: GeneralProps) {
    let params = useParams()
    let [group, setGroup] = useState<GroupType>({ name: "pending" } as GroupType)
    let [members, setMembers] = useState<any[]>([<Loading key="loading" caller="GroupPage/members" />])
    let [games, setGames] = useState<any[]>([<Loading key="loading" caller="GroupPage/games" />])
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
    useEffect(() => {
        let out: any[] = []
        if (group.games !== undefined) {
            for (const game of group.games) {
                out.push(<GroupGame key={game._id.toString()} gameid={game._id.toString()} groupid={params.groupid as string} {...props} />)
            }
        }
        setGames(() => out)
    }, [group.games, params.groupid, props])

    //http://localhost:3000/groups/624c6952105d34b41c3cbf54/edit

    return (<div className="ViewGroup">
        <h1>{group.name}<Link className="edit_icon" to={`/groups/${group._id}/edit`}><FontAwesomeIcon icon={faPenToSquare} /></Link></h1>
        <p>{group.private ? "private" : "public"}</p>
        <br />
        <div className="memberslist"><div className="label">Members:</div>{members}</div>
        <div className="label">Games:</div><div className="gameslist">{games}</div>
    </div>)
}


export default GroupPage