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
import { NavLink } from "react-router-dom"
import TagCloud from "../bits/TagCloud"
import GroupViewButton from "../bits/GroupViewButton"
import GenericButton from "../bits/GenericButton"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface GIProps extends GeneralProps {
    group: GroupType
}

function GroupItem(props: GIProps) {
    let [classes, setClasses] = useState<string>("group GroupItem")
    let [jlButton, setJLButton] = useState<anyElement>(<Loading caller="GroupItem/JLButton" />)
    let [iButton, setiButton] = useState<anyElement>(<Loading caller="GroupItem/iButton" />)

    let del = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        props.api.group.del(props.group._id).then(() => props.dbupdate("groups"), reason => console.error(`delete failed with ${reason}`))
        props.dbupdate("groups") // This is needed because the delete method doesn't seem to complete nor error somehow?
    }, [props])

    let noop = useCallback(e => 1, []) // These buttons are actually links so don't need to react.

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
        setiButton(<NavLink to={`/groups/${props.group._id}/invite`}><GroupInviteButton onClick={noop} disabled={!(isMember && isPrivate)} {...props} /></NavLink>)
        if (isMember) {
            setJLButton(<GroupLeaveButton onClick={leave} {...props} />)
        } else if (isPrivate) {
            setJLButton(<GroupJoinButton onClick={join} disabled {...props} />)
        } else {
            setJLButton(<GroupJoinButton onClick={join} {...props} />)
            setiButton(<GroupDelButton onClick={del} {...props} />)
        }
    }, [join, leave, del, props, props.group, props.group.private, noop])

    const [getRecalcRunning, setRecalcRunning] = useState<boolean>(false)

    const recalc = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setRecalcRunning(true)
        props.api.group.recalc(props.group._id).then(() => setRecalcRunning(false))
    }, [props.api.group, props.group._id])

    return <div className={classes}>
        <div className="header">{props.group.name}</div>
        <p>{props.group.description}</p>
        <TagCloud includeTags={props.group.filters?.includeTags ?? []} excludeTags={props.group.filters?.excludeTags ?? []} {...props} />
        <div className="buttons">
            {jlButton}
            {iButton}
            <NavLink to={`/groups/${props.group._id}/edit`}><GroupEditButton onClick={noop} {...props} /></NavLink>
            <NavLink to={`/group/${props.group._id}`}><GroupViewButton onClick={noop} {...props} /></NavLink>
            <GenericButton disabled={getRecalcRunning} maintype="RecalcButton" onClick={recalc} {...props}>
                <FontAwesomeIcon icon={faRotate} />
            </GenericButton>
        </div>
    </div>
}

export default GroupItem