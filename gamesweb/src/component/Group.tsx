import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GroupType } from "../libs/types/Group"
import { GeneralProps } from "./GeneralProps"
import GroupGame from "./GroupGame"

function Group(props: GeneralProps) {
    let params = useParams()
    let [group, setGroup] = useState<GroupType>({ name: "pending" } as GroupType)
    let [members, setMembers] = useState<any[]>([<div className="loading">Loading...</div>])
    let [games, setGames] = useState<any[]>([<div className="loading">Loading...</div>])
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
                out.push(<GroupGame gameid={game._id.toString()} groupid={params.groupid as string} {...props} />)
            }
        }
        setGames(() => out)
    }, [group.games, params.groupid, props])
    return (<>
        <h1>{group.name}</h1>
        <p>{group.private ? "private" : "public"}</p>
        <br />
        <div className="memberslist"><div className="label">Members:</div>{members}</div>
        <div className="label">Games:</div><div className="gameslist">{games}</div>
    </>)
}


export default Group