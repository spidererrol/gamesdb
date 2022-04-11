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

function autoName(url: string, nameRef: React.RefObject<HTMLInputElement>): void {
    if (nameRef.current === null)
        return
    if (nameRef.current.value !== "")
        return
    if (url.startsWith("https://store.steampowered.com/"))
        nameRef.current.value = "Steam"
    else if (url.startsWith("https://www.co-optimus.com/"))
        nameRef.current.value = "Co-Optimus"
    else if (url.startsWith("https://www.gog.com/"))
        nameRef.current.value = "GOG.com"
    else if (url.startsWith("https://isthereanydeal.com/"))
        nameRef.current.value = "IsThereAnyDeal"
}

const EditGameLink = forwardRef((props: EGLProps, ref: Ref<EGLRef>) => {
    const nameRef = createRef<HTMLInputElement>()
    const urlRef = createRef<HTMLInputElement>()

    const updateName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.updateAction(e, props.uid)
    }, [props])

    const updateUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        autoName(e.target.value, nameRef)
        props.updateAction(e, props.uid)
    }, [nameRef, props])

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
        <LabelInput ref={nameRef} type="text" label="Name" name="name" value={props.name} onChange={updateName} placeholder="New" />
        <LabelInput ref={urlRef} type="text" label="URL" name="url" value={props.url} inputClass="linkurl" onChange={updateUrl} placeholder="https://" />
        <DelButton onClick={props.delAction} data={props.uid} />
    </div>

})

export default EditGameLink