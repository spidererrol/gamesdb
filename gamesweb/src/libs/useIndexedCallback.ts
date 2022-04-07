import { useCallback } from "react"
import { IndexedChangeEventHandler } from "./utils"

export function useIndexedCallback<T extends Element, I>(index: I, callback: IndexedChangeEventHandler<T, I> | undefined): React.ChangeEventHandler<T> | undefined {
    if (callback === undefined)
        return undefined
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
        (e: React.ChangeEvent<T>) => callback(e, index),
        [callback, index]
    )
}
