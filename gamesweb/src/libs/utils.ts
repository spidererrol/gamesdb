// ### FUNCTIONS ###

import { useState, useEffect, Key } from "react"
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

export function makeCloudItems<T>(indata: T[], map: (i: T) => CloudItem): Map<Key, CloudItem> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [outdata, setOutData] = useState<Map<Key, CloudItem>>(new Map<Key, CloudItem>())
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isKnown(indata)) {
            let out = new Map<Key, CloudItem>()
            for (const item of indata) {
                const ci = map(item)
                out.set(ci.key, ci)
            }
            setOutData(out)
        }
        // setOutData(indata.map(map))
    }, [indata, map])
    return outdata
}

export function makeCloudItemsSettable<T>(indata: T[], map: (i: T) => CloudItem): [Map<Key, CloudItem>, React.Dispatch<React.SetStateAction<Map<Key, CloudItem>>>] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [outdata, setOutData] = useState<Map<Key, CloudItem>>(new Map<Key, CloudItem>())
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isKnown(indata)) {
            let out = new Map<Key, CloudItem>()
            for (const item of indata) {
                const ci = map(item)
                out.set(ci.key, ci)
            }
            setOutData(out)
        }
        // setOutData(indata.map(map))
    }, [indata, map])
    return [outdata, setOutData]
}

export function mapmap<K, V, R>(input: Map<K, V>, mapper: (k: K, v: V) => R): R[] {
    let ret: R[] = []
    let itr = input.entries()
    for (let i = 0; i < input.size; i++) {
        let [k, v] = itr.next().value
        ret.push(mapper(k, v))
    }
    return ret
}

export function mapfilter<K, V>(input: Map<K, V>, filter: (k: K, v: V) => boolean): Map<K, V> {
    let ret = new Map<K, V>()
    let itr = input.entries()
    for (let i = 0; i < input.size; i++) {
        let [k, v] = itr.next().value
        if (filter(k, v))
            ret.set(k, v)
    }
    return ret
}

export function formap<K, V>(map: Map<K, V>, func: (k: K, v: V) => void): void {
    const itr = map.entries()
    for (let i = 0; i < map.size; i++) {
        let [k, v] = itr.next().value
        func(k, v)
    }
}

export function array2map<K, V, I>(input: I[], map: (i: I) => [k: K, v: V]): Map<K, V> {
    const outmap = new Map<K, V>()
    for (const i of input) {
        const [k, v] = map(i)
        outmap.set(k, v)
    }
    return outmap
}

export function cloneMap<K, V>(input: Map<K, V>) {
    return new Map<K, V>(input)
}

export type IndexedChangeEventHandler<ElementType,IndexType> = (e:React.ChangeEvent<ElementType>,i:IndexType)=>void

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
