import { createRef, useCallback, useEffect, useState } from "react"
import { GameType } from "../../libs/types/Game"
import { isKnown, makeCloudItems, makeElements } from "../../libs/utils"
import GenericCloud from "../bits/GenericCloud"
import LabelSelect, { OptionInfo } from "../bits/LabelSelect"
import { GeneralProps } from "../props/GeneralProps"
import GameLinks from "./GameLinks"

interface EGProps extends GeneralProps {
}

function EditGame(props: EGProps): JSX.Element {
    // let aliases = makeElements(props.game.aliases, useCallback(a => <div key={a} className="alias">{a}</div>, []))
    // let tags = makeCloudItems(props.game.tags, useCallback(t => { return { key: t, display: t } }, []))
    // let vote_ref = createRef<HTMLSelectElement>()
    // let [vote, setVote] = useState<string>("None")
    // let [options, setOptions] = useState<OptionInfo[]>([])
    // useEffect(() => {
    //     if (isKnown(props.game.myVote?.vote)) {
    //         setVote(props.game.myVote?.vote as string)
    //     } else {
    //         setVote("None")
    //     }
    // }, [props.game])
    // useEffect(() => {
    //     setOptions([
    //         { content: "Desire", },
    //         { content: "Accept", },
    //         { content: "Veto", }
    //     ])
    // }, [])
    // let change_vote = useCallback((e) => {
    //     e.preventDefault()
    //     props.api.game.vote(props.game._id, vote_ref.current?.value as "Desire" | "Accept" | "Vote").then(()=>props.dbupdate("games"))
    // }, [props, vote_ref])

    // return <fieldset className="game">
    //     <legend>{props.game.name}</legend>
    //     {aliases}
    //     <div className="prop">Min Players: {props.game.minPlayers ?? "unknown"}</div>
    //     <div className="prop">Max Players: {props.game.maxPlayers ?? "unknown"}</div>
    //     <div className="vote_owner prop">
    //         <LabelSelect ref={vote_ref} name="vote" label="Vote" selected={vote} onChange={change_vote} options={options} {...props} />
    //     </div>
    //     <GameLinks {...props} />
    //     <GenericCloud getItems={tags} {...props} />
    // </fieldset>
    return <>TODO</>
}

export default EditGame