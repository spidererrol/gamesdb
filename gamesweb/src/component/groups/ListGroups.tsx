import { createRef, useCallback, useEffect, useState } from "react"
import { GroupType } from "../../libs/types/Group"
import { anyElementList } from "../../libs/types/helpers"
import LabelInput from "../bits/LabelInput"
import { GeneralProps } from "../props/GeneralProps"
import GroupItem from "./GroupItem"

function ListGroups(props: GeneralProps) {
    const [getGroupData, setGroupData] = useState<GroupType[]>([])
    const [el_list, set_el_list] = useState<anyElementList>([<div key="loading" className="loading">Loading...</div>])
    const refSearch = createRef<HTMLInputElement>()

    useEffect(() => {
        let outlist: anyElementList = []
        for (const group of getGroupData) {
            outlist.push(<GroupItem key={group._id.toString()} group={group} {...props} />)
        }
        set_el_list(outlist)
    }, [getGroupData, props])

    useEffect(() => {
        props.api.group.getAvailable().then(groups => setGroupData(groups.sort((a, b) => a.name.localeCompare(b.name))))
    }, [props, props.dbupdates.groups])

    const search = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: HTMLInputElement, preventDefault: Function }) => {
        e.preventDefault()
        let query: Promise<GroupType[]>
        if (e.target.value.trim() === "")
            query = props.api.group.getAvailable()
        else
            query = props.api.group.search(e.target.value)
        query.then(groups => setGroupData(groups))
    }, [props.api.group])

    const clear = useCallback((e) => {
        if (refSearch.current !== null) {
            refSearch.current.value = "" // Doesn't trigger onChange!
            search({ target: refSearch.current, preventDefault: () => null })
        }
    }, [refSearch, search])

    return <fieldset className="grouplist ListGroups">
        <legend>Groups</legend>
        <LabelInput ref={refSearch} label="Search" type="text" placeholder="(all)" onChange={search} onClear={clear} />
        <div className="group_list">{el_list}</div>
    </fieldset>
}

export default ListGroups