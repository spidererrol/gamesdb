import React, { createRef, useCallback, useState } from "react"
import LabelInput from "../bits/LabelInput"
import LabelTextarea from "../bits/LabelTextarea"
import MinMaxEdit from "../bits/MinMaxEdit"
import TagSetEdit from "../bits/TagSetEdit"
import { GeneralProps } from "../props/GeneralProps"

function AddGroup(props: GeneralProps) {
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

    const [result, setResults] = useState<string>("")


    /*
        name: string,
        description: string,
        private: boolean,
        added: WhenWhoType,
        filters: {
            maxPlayers: RangeFilterType,
            maxPlayers: RangeFilterType,
            includeTags: string[],
            excludeTags: string[],
        },
        members: UserType[], // Duplicates UserGroup but wanted for searching for private groups
        games: GameType[], // Duplicates GameGroup, don't know if I need it.
    
    */

    const addgroup = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("AddGroup")
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
        setResults(JSON.stringify(await props.api.group.create(setobj), undefined, 2))
        // setResults(JSON.stringify(setobj, undefined, 2))
    }, [excludeTags, group_description_ref, group_name_ref, group_private_ref, includeTags, maxPlayer_max, maxPlayer_min, minPlayer_max, minPlayer_min, props.api.group])

    return <div className="AddGroup"><fieldset>
        <legend>Add Group</legend>
        <form onSubmit={addgroup}>
            <LabelInput id="group_name" name="name" ref={group_name_ref} type="text" label="Name" label_as_placeholder={true} {...props} />
            <LabelTextarea id="group_description" name="description" ref={group_description_ref} label="Description" label_as_placeholder={true} {...props} />
            <LabelInput id="group_private" name="private" type="checkbox" ref={group_private_ref} label="Private?" label_as_placeholder={true} {...props} />
            <fieldset className="filters">
                <legend>Filters</legend>
                {/* <LabelInput id="group_minPlayers" name="minPlayers" ref={group_minPlayers_min_ref} type="number" label="Min Players" value="1" {...props} /> */}
                {/* <LabelInput id="group_maxPlayers" name="maxPlayers" ref={group_maxPlayers_min_ref} type="number" label="Max Players" {...props} /> */}
                <MinMaxEdit id_prefix="minPlayers" display="Min Players" minSetter={setMinPlayer_min} maxSetter={setMinPlayer_max} minGetter={minPlayer_min} maxGetter={minPlayer_max} {...props} />
                <MinMaxEdit id_prefix="maxPlayers" display="Max Players" minSetter={setMaxPlayer_min} maxSetter={setMaxPlayer_max} minGetter={maxPlayer_min} maxGetter={maxPlayer_max} {...props} />
                <TagSetEdit incexc="Include" getter={includeTags} setter={setIncludeTags} {...props} />
                <TagSetEdit incexc="Exclude" getter={excludeTags} setter={setExcludeTags} {...props} />
            </fieldset>
            <input type="submit" value="Create" />
        </form>
    </fieldset><fieldset><legend>Results</legend><pre>{result}</pre></fieldset></div>
}

export default AddGroup