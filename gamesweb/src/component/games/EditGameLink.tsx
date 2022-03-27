import { createRef, forwardRef, Ref, useCallback, useImperativeHandle } from "react"
import DelButton, { ButtonAction } from "../bits/DelButton"
import ExtLink from "../bits/ExtLink"
import LabelInput from "../bits/LabelInput"

interface EGLProps {
    uid: number
    name: string
    url: string
    // nameRef?: Ref<HTMLInputElement>
    // urlRef?: Ref<HTMLInputElement>
    delAction: ButtonAction
    updateAction: (e: React.ChangeEvent<HTMLInputElement>, i: number) => void
}

export interface EGLRef {
    get name(): HTMLInputElement | null
    get url(): HTMLInputElement | null
}

const EditGameLink = forwardRef((props: EGLProps, ref: Ref<EGLRef>) => {
    const nameRef = createRef<HTMLInputElement>()
    const urlRef = createRef<HTMLInputElement>()

    const updateAction = useCallback((e)=>{
        props.updateAction(e, props.uid);
    },[props])

    useImperativeHandle(ref, () => ({
        get name() {
            return nameRef.current
        },
        get url() {
            return urlRef.current
        }
    }))

    return <div className="linkcontainer">
        <ExtLink href={props.url} display={props.name} />
        <LabelInput ref={nameRef} type="text" label="Name" name="name" value={props.name} onChange={updateAction} />
        <LabelInput ref={urlRef} type="text" label="URL" name="url" value={props.url} inputClass="linkurl" onChange={updateAction} />
        <DelButton onClick={props.delAction} data={props.uid} />
    </div>

})

export default EditGameLink