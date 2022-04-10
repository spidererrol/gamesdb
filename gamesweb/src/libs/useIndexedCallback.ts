import { useCallback } from "react"
import { UpdateState } from "../component/bits/UpdateMark"
import { DataUpdateCallback, IndexedChangeEventHandler } from "./utils"

export function useIndexedCallback<T extends Element, I>(index: I, callback: IndexedChangeEventHandler<T, I> | undefined): React.ChangeEventHandler<T> | undefined {
    if (callback === undefined)
        return undefined
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
        (e: React.ChangeEvent<T>) => callback(e, index),
        [callback, index]
    )
}

export function useIndexedUpdateCallback<E extends React.SyntheticEvent, I>(index: I, callback: DataUpdateCallback<E, I> | undefined, updateSetter: React.Dispatch<React.SetStateAction<UpdateState>>) {
    if (callback === undefined)
        return undefined
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
        (e: E) => {
            const finished = () => updateSetter(UpdateState.Updated)
            updateSetter(UpdateState.Updating)
            callback(e, index, finished)
        },
        [callback, index, updateSetter]
    )
}