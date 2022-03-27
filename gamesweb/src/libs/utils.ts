// ### FUNCTIONS ###

import { useState, useEffect } from "react"
import { CloudItem } from "./types/CloudItem"
import { anyElement, anyElementList } from "./types/helpers"


export function isKnown(value?: any | null): value is any {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function isKnown_type<T>(value?: T | null): value is T {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function makeElements<T>(indata: T[], map: (i: T) => anyElement): anyElementList {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [outdata, setOutData] = useState<anyElementList>([])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setOutData(indata.map(map))
    }, [indata, map])
    return outdata
}

export function makeCloudItems<T>(indata: T[], map: (i: T) => CloudItem): CloudItem[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [outdata, setOutData] = useState<CloudItem[]>([])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setOutData(indata.map(map))
    }, [indata, map])
    return outdata
}

// ### Environment ###

interface has_toString {
    toString(): string
};

export function isStringable(value: has_toString | undefined): value is has_toString {
    if (typeof value === 'undefined') return false
    if ((value as has_toString).toString) {
        return true
    }
    return false
}

export function safeToString(thing?: has_toString): string | undefined {
    if (isStringable(thing)) {
        return thing.toString()
    }
    return undefined
}
