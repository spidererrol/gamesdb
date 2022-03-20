import React, { createRef, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { GroupType } from "../../libs/types/Group"
import { isKnown } from "../../libs/utils"
import LabelInput from "../bits/LabelInput"
import LabelTextarea from "../bits/LabelTextarea"
import MinMaxEdit from "../bits/MinMaxEdit"
import TagSetEdit from "../bits/TagSetEdit"
import { GeneralProps } from "../props/GeneralProps"

function EditGroup(props: GeneralProps) {
    const params = useParams()
    const [group, setGroup] = useState<GroupType>({} as GroupType)
    useEffect(() => {
        props.api.group.get(params.groupid as string).then(g => setGroup(g))
    }, [params.groupid, props.api.group])
    // const group = props.api.group.get(params.groupid as string)
    const group_name_ref = createRef<HTMLInputElement>()
    const group_description_ref = createRef<HTMLTextAreaElement>()
    const group_private_ref = createRef<HTMLInputElement>()
    // const group_minPlayers_min_ref = createRef<HTMLInputElement>()
    // const group_minPlayers_max_ref = createRef<HTMLInputElement>()
    // const group_maxPlayers_min_ref = createRef<HTMLInputElement>()
    // const group_maxPlayers_max_ref = createRef<HTMLInputElement>()
    const [minPlayer_min, setMinPlayer_min] = useState<number>()
    const [minPlayer_max, setMinPlayer_max] = useState<number>()
    const [maxPlayer_min, setMaxPlayer_min] = useState<number>()
    const [maxPlayer_max, setMaxPlayer_max] = useState<number>()
    const [includeTags, setIncludeTags] = useState<string[]>([])
    const [excludeTags, setExcludeTags] = useState<string[]>([])

    useEffect(() => {
        setMinPlayer_min(group?.filters?.minPlayers?.above)
        setMinPlayer_max(group?.filters?.minPlayers?.below)
        setMaxPlayer_min(group?.filters?.maxPlayers?.above)
        setMaxPlayer_max(group?.filters?.maxPlayers?.below)
        setIncludeTags(group?.filters?.includeTags ?? [])
        setExcludeTags(group?.filters?.excludeTags ?? [])
    }, [group])

    const [result, setResults] = useState<string>("")

    const addgroup = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Edit Group")
        let setobj: any = {}
        setobj.name = group_name_ref.current?.value
        setobj.description = group_description_ref.current?.value
        setobj.private = group_private_ref.current?.checked
        let filters: any = setobj.filters = {}
        filters.minPlayers = {
            above: minPlayer_min,
            below: minPlayer_max,
        }
        filters.maxPlayers = {
            above: maxPlayer_min,
            below: maxPlayer_max,
        }
        filters.includeTags = includeTags
        filters.excludeTags = excludeTags
        setResults(JSON.stringify(await props.api.group.update(params.groupid as string, setobj), undefined, 2))
    }, [excludeTags, group_description_ref, group_name_ref, group_private_ref, includeTags, maxPlayer_max, maxPlayer_min, minPlayer_max, minPlayer_min, params.groupid, props.api.group])

    return <div className="EditGroup"><fieldset>
        <legend>Edit Group</legend>
        <form onSubmit={addgroup}>
            <LabelInput id="group_name" name="name" ref={group_name_ref} type="text" label="Name" label_as_placeholder={true} value={group.name} {...props} />
            <LabelTextarea id="group_description" name="description" ref={group_description_ref} label="Description" label_as_placeholder={true} value={group.description} {...props} />
            <LabelInput id="group_private" name="private" type="checkbox" ref={group_private_ref} label="Private?" label_as_placeholder={true} defaultChecked={group.private} {...props} />
            <fieldset className="filters">
                <legend>Filters</legend>
                {/* <LabelInput id="group_minPlayers" name="minPlayers" ref={group_minPlayers_min_ref} type="number" label="Min Players" value="1" {...props} /> */}
                {/* <LabelInput id="group_maxPlayers" name="maxPlayers" ref={group_maxPlayers_min_ref} type="number" label="Max Players" {...props} /> */}
                <MinMaxEdit id_prefix="minPlayers" display="Min Players" minSetter={setMinPlayer_min} maxSetter={setMinPlayer_max} minGetter={minPlayer_min} maxGetter={minPlayer_max} {...props} />
                <MinMaxEdit id_prefix="maxPlayers" display="Max Players" minSetter={setMaxPlayer_min} maxSetter={setMaxPlayer_max} minGetter={maxPlayer_min} maxGetter={maxPlayer_max} {...props} />
                <TagSetEdit incexc="Include" getter={includeTags} setter={setIncludeTags} {...props} />
                <TagSetEdit incexc="Exclude" getter={excludeTags} setter={setExcludeTags} {...props} />
            </fieldset>
            <input type="submit" value="Update" />
        </form>
    </fieldset><fieldset><legend>Results</legend><pre>{result}</pre></fieldset></div>
}

export default EditGroup