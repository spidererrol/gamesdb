import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { GroupType } from "../../libs/types/Group"
import { isKnown } from "../../libs/utils"
import GenericCloud, { CloudItem } from "../bits/GenericCloud"
import Loading from "../bits/Loading"
import { GeneralProps } from "../props/GeneralProps"

function GroupInvite(props: GeneralProps) {
    const params = useParams()
    const [group, setGroup] = useState<GroupType>({} as GroupType)
    const [members, setMembers] = useState<CloudItem[]>([{
        key: "loading",
        display: <Loading />
    }])
    const [nonmembers, setNonMembers] = useState<CloudItem[]>([{
        key: "loading",
        display: <Loading />
    }])
    useEffect(() => {
        props.api.group.get(params.groupid as string).then(g => setGroup(g))
    }, [params.groupid, props.api.group, props.dbupdates.groups])
    useEffect(() => {
        let out: CloudItem[] = []
        if (group.members !== undefined) {
            for (const member of group.members) {
                out.push({
                    key: member._id,
                    display: member.displayName
                })
            }
        }
        setMembers(() => out)
    }, [group])
    useEffect(() => {
        if (!isKnown(group.members))
            return
        props.api.user.getAll().then(users => setNonMembers(users.filter(
            u => !group.members.map(m => m._id).includes(u._id)
        ).map(u => { return { key: u._id, display: u.displayName } })))
    }, [group, props.api.user])

    const invite = useCallback((event, item) => {
        event.preventDefault()
        props.api.group.invite(params.groupid as string, item.key).then(() => props.dbupdate("groups"))
    }, [params.groupid, props])

    const kick = useCallback((event, item) => {
        event.preventDefault()
        if (item.key === props.myuser.get._id) {
            console.log("Will not expel yourself!")
            return
        }
        if (props.myuser.get.isAdmin) {
            console.log("kick")
            props.api.group.expel(params.groupid as string, item.key).then(() => props.dbupdate("groups"))
        } else {
            console.log("Not Admin")
        }
    }, [params.groupid, props])

    return <>
        <h1>{group.name}</h1>
        <p>{group.private ? "private" : "public"}</p>
        <br />
        <fieldset className="memberscloud included">
            <legend>Current Members:</legend>
            <GenericCloud getItems={members} onClick={kick} {...props} />
        </fieldset>
        <fieldset className="nonmemberscloud included">
            <legend>Non-Members:</legend>
            <GenericCloud getItems={nonmembers} onClick={invite} {...props} />
        </fieldset>
    </>
}

export default GroupInvite