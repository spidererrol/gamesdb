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

function nameMap(url: string): string | null {
    if (url.startsWith("https://store.steampowered.com/")) {
        return "Steam"
    } else if (url.startsWith("https://www.co-optimus.com/")) {
        return "Co-Optimus"
    } else if (url.startsWith("https://www.gog.com/")) {
        return "GOG.com"
    } else if (url.startsWith("https://isthereanydeal.com/")) {
        return "IsThereAnyDeal"
    }
    return null
}

function autoName(url: string, nameRef: React.RefObject<HTMLInputElement>): boolean {
    if (nameRef.current === null)
        return false
    if (nameRef.current.value !== "")
        return false
    const newname = nameMap(url)
    if (newname !== null) {
        nameRef.current.value = newname
        return true
    }
    return false
}

const EditGameLink = forwardRef((props: EGLProps, ref: Ref<EGLRef>) => {
    const nameRef = createRef<HTMLInputElement>()
    const urlRef = createRef<HTMLInputElement>()

    const updateName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.updateAction(e, props.uid)
    }, [props])

    const updateUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (autoName(e.target.value, nameRef)) {
            props.updateAction({
                target: {
                    name: "name",
                    value: nameRef.current?.value as string
                }
            } as React.ChangeEvent<HTMLInputElement>, props.uid)
        }
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
        <LabelInput ref={nameRef} type="text" label="Name" name="name" value={props.name} onChange={updateName} placeholder="New" inputTitle="[MUST BE UNIQUE] Add an ! at the end to force text display or use a url for an icon" />
        <LabelInput ref={urlRef} type="text" label="URL" name="url" value={props.url} inputClass="linkurl" onChange={updateUrl} placeholder="https://" />
        <DelButton onClick={props.delAction} data={props.uid} />
    </div>

})

export default EditGameLink