import { PlayModeType } from "../../libs/types/PlayMode"
import { GeneralProps } from "../props/GeneralProps"
import VoteEdit from "../bits/VoteEdit"
import OwnedEdit from "../bits/OwnedEdit"
import DelButton, { ButtonAction } from "../bits/DelButton"
import { anyElement } from "../../libs/types/helpers"
import { createRef, useCallback, useEffect, useState } from "react"
import { IndexedChangeEventHandler, isKnown } from "../../libs/utils"
import Loading from "../bits/Loading"
import UnDelButton from "../bits/UnDelButton"

export type PlayModeChangeEventHandler<ElementType = Element> = IndexedChangeEventHandler<ElementType, string>

interface EPMProps extends GeneralProps {
    playmode: PlayModeType
    nameUpdate?: PlayModeChangeEventHandler
    voteUpdate?: PlayModeChangeEventHandler
    ownedStateUpdate?: PlayModeChangeEventHandler
    ownedPriceUpdate?: PlayModeChangeEventHandler
    descriptionUpdate?: PlayModeChangeEventHandler
    includedUpdate?: PlayModeChangeEventHandler
    delAction?: ButtonAction
    unDelAction?: ButtonAction
}

function useIndexedCallback<T extends Element, I>(index: I, callback: IndexedChangeEventHandler<T, I> | undefined): React.ChangeEventHandler<T> | undefined {
    if (callback === undefined)
        return undefined
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
        (e: React.ChangeEvent<T>) => callback(e, index),
        [callback, index]
    )
}

/**
 * 
 * @param playmode PlayModeType object
 * @param nameUpdate callback for when name input control changes
 * @param voteUpdate callback for when vote updates
 * @param ownedStateUpdate callback
 * @param ownedPriceUpdate callback
 * @param descriptionUpdate callback
 * @param delAction callback
 * @param includedUpdate callback
 */
function EditPlayMode(props: EPMProps) {
    const includedRef = createRef<HTMLInputElement>()
    const [ownedEdit, setOwnedEdit] = useState(<Loading />)
    const ownedStateUpdate = useIndexedCallback(props.playmode._id, props.ownedStateUpdate)
    const ownedPriceUpdate = useIndexedCallback(props.playmode._id, props.ownedPriceUpdate)
    const includedUpdate = useCallback((_e?: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Update included")
        if (includedRef.current?.checked) {
            // console.log("TRUE")
            setOwnedEdit(<>included</>)
        } else {
            // console.log("FALSE")
            setOwnedEdit(<OwnedEdit {...props.playmode.myOwner} selectSetter={ownedStateUpdate} priceSetter={ownedPriceUpdate} />)
        }
        if (isKnown(props.includedUpdate)) {
            let iu = props.includedUpdate as PlayModeChangeEventHandler
            iu(_e as React.ChangeEvent<HTMLInputElement>, props.playmode._id)
        }
    }, [includedRef, ownedPriceUpdate, ownedStateUpdate, props.includedUpdate, props.playmode._id, props.playmode.myOwner])

    useEffect(() => {
        if (props.playmode.included) {
            // console.log("TRUE")
            setOwnedEdit(<>included</>)
        } else {
            // console.log("FALSE")
            setOwnedEdit(<OwnedEdit {...props.playmode.myOwner} selectSetter={ownedStateUpdate} priceSetter={ownedPriceUpdate} />)
        }
    }, [ownedPriceUpdate, ownedStateUpdate, props.playmode.included, props.playmode.myOwner])

    const [delButton, setDelButton] = useState<anyElement>(<></>)
    useEffect(() => {
        if (isKnown(props.delAction))
            setDelButton(<DelButton onClick={props.delAction as ButtonAction} data={props.playmode._id} />)
        else
            setDelButton(<></>)
    }, [props.delAction, props.playmode._id])

    const [unDelButton, setUnDelButton] = useState<anyElement>(<></>)
    useEffect(() => {
        if (isKnown(props.unDelAction))
            setUnDelButton(<UnDelButton onClick={props.unDelAction as ButtonAction} data={props.playmode._id} />)
        else
            setUnDelButton(<></>)
    }, [props.playmode._id, props.unDelAction])

    const [classNames, setClassNames] = useState<string>("Edit PlayMode")

    useEffect(() => {
        if (props.playmode._isdeleted)
            setClassNames("Edit PlayMode deleted")
        else
            setClassNames("Edit PlayMode")
    }, [props.playmode._isdeleted])

    return <div className={classNames}>
        <div className="name"><input defaultValue={props.playmode.name} onChange={useIndexedCallback(props.playmode._id, props.nameUpdate)} /></div>
        <div className="icons">
            <VoteEdit vote={props.playmode.myVote.vote} setter={useIndexedCallback(props.playmode._id, props.voteUpdate)} />
            <input type="checkbox" ref={includedRef} defaultChecked={props.playmode.included} onChange={includedUpdate} title="Included with main game?" />
            {ownedEdit}
        </div>
        <div className="description">
            <textarea defaultValue={props.playmode.description} onChange={useIndexedCallback(props.playmode._id, props.descriptionUpdate)} />
        </div>
        {delButton}
        <div className="delcover"><span>DELETED</span>{unDelButton}</div>
    </div>
}

export default EditPlayMode