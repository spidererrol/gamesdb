import { useCallback, useEffect, useState } from "react"
import { GroupType } from "../../libs/types/Group"
import { anyElement } from "../../libs/types/helpers"
import { GeneralProps } from "../props/GeneralProps"
import Loading from "../bits/Loading"
import GroupInviteButton from "../bits/GroupInviteButton"
import GroupLeaveButton from "../bits/GroupLeaveButton"
import GroupJoinButton from "../bits/GroupJoinButton"
import GroupEditButton from "../bits/GroupEditButton"
import GroupDelButton from "../bits/GroupDelButton"
import { Link } from "react-router-dom"
import TagCloud from "../bits/TagCloud"

interface GIProps extends GeneralProps {
    group: GroupType
}

//TODO: Make Join, Invite & Leave buttons do something
//TODO: Notify that a db change has/might have happened upstream (at least per-table, possibly also per-object?)

function GroupItem(props: GIProps) {
    let [classes, setClasses] = useState<string>("group GroupItem")
    let [jlButton, setJLButton] = useState<anyElement>(<Loading caller="GroupItem/JLButton" />)
    let [iButton, setiButton] = useState<anyElement>(<Loading caller="GroupItem/iButton" />)

    let todo = useCallback((e: any) => {
        console.log("TODO!")
        return
    }, [])

    let noop = useCallback(e => 1, [])

    let join = useCallback(async e => {
        e.preventDefault()
        await props.api.group.join(props.group._id)
        props.dbupdate("groups")
    }, [props])

    let leave = useCallback(async e => {
        e.preventDefault()
        await props.api.group.leave(props.group._id)
        props.dbupdate("groups")
    }, [props])

    useEffect(() => {
        let isPrivate = props.group.private
        let isMember = (props.group as any).isMember
        setClasses("group GroupItem" + (isPrivate ? " private" : "") + (isMember ? " member" : ""))
        setiButton(<Link to={`/groups/${props.group._id}/invite`}><GroupInviteButton onClick={noop} disabled={!(isMember && isPrivate)} {...props} /></Link>)
        if (isMember) {
            setJLButton(<GroupLeaveButton onClick={leave} {...props} />)
        } else if (isPrivate) {
            setJLButton(<GroupJoinButton onClick={join} disabled {...props} />)
        } else {
            setJLButton(<GroupJoinButton onClick={join} {...props} />)
            setiButton(<GroupDelButton onClick={todo} {...props} />)
        }
    }, [join, leave, todo, props, props.group, props.group.private, noop])
    return <div className={classes}>
        <div className="header">{props.group.name}</div>
        <p>{props.group.description}</p>
        <TagCloud includeTags={props.group.filters?.includeTags ?? []} excludeTags={props.group.filters?.excludeTags ?? []} {...props} />
        <div className="buttons">
            {jlButton}
            {iButton}
            <Link to={`/groups/${props.group._id}/edit`}><GroupEditButton onClick={noop} {...props} /></Link>
        </div>
    </div>
}

export default GroupItem