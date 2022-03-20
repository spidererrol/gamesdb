import { useEffect, useState } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { GeneralProps } from "../props/GeneralProps"
import GroupItem from "./GroupItem"

function ListGroups(props: GeneralProps) {
    let [el_list, set_el_list] = useState<anyElementList>([<div key="loading" className="loading">Loading...</div>])

    useEffect(() => {
        props.api.group.getAvailable().then(groups => {
            let outlist: anyElementList = []
            for (const group of groups) {
                outlist.push(<GroupItem key={group._id.toString()} group={group} {...props} />)
            }
            set_el_list(outlist)
        })
    }, [props,props.dbupdates.groups])

    return <fieldset className="grouplist ListGroups">
        <legend>Groups</legend>
        {el_list}
    </fieldset>
}

export default ListGroups