// ### FUNCTIONS ###

import { useState, useEffect, Key } from "react"
import { CloudItem } from "./types/CloudItem"
import { DBBase } from "./types/DBBase"
import { anyElement, anyElementList } from "./types/helpers"
import { NRMap } from "./types/InputRef"
import { NMap } from "./types/NMap"


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

export function map2object<K, V, O>(map: Map<K, V>, func: (k: K, v: V) => O): any {
    let out: any = {}
    const itr = map.entries()
    for (let i = 0; i < map.size; i++) {
        let [k, v] = itr.next().value
        let add = func(k, v)
        out = { ...out, ...add }
    }
    return out
}

export function map2array<K, V, O>(map: Map<K, V>, func: (k: K, v: V) => O): O[] {
    let out: O[] = []
    const itr = map.entries()
    for (let i = 0; i < map.size; i++) {
        let [k, v] = itr.next().value
        out.push(func(k, v))
    }
    return out
}

export function array2map<K, V, I>(input: I[], map: (i: I) => [k: K, v: V]): Map<K, V> {
    const outmap = new Map<K, V>()
    for (const i of input) {
        const [k, v] = map(i)
        outmap.set(k, v)
    }
    return outmap
}

export function cloneMap<K, V>(input: Map<K, V>): Map<K, V> {
    return new Map<K, V>(input)
}

export type IndexedChangeEventHandler<ElementType, IndexType> = (e: React.ChangeEvent<ElementType>, i: IndexType) => void

export function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null)
            )
        })
    })
}

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

export function beString(thing?: has_toString | string): string | undefined {
    if (isStringable(thing)) {
        return thing.toString()
    }
    return thing
}

interface has_id {
    _id: has_toString | string | undefined
}

export function isHasId(value: has_id | has_toString | string | undefined): value is has_id {
    if (typeof value === 'undefined') return false
    if ((value as has_id)._id) {
        return true
    }
    return false
}


export function idString(thing?: has_id | has_toString | string): string | undefined {
    if (isHasId(thing)) {
        return beString(thing._id)
    }
    return beString(thing)
}

export type NSMap = NMap<string>

export function newNSMap(init?: any) {
    return new Map<number, string>(init)
}
export function haveBlank(refs: NRMap) {
    return mapfilter(refs, (_k, ar) => ar.current?.value === "").size > 0
}
export async function array2promisechain<T>(inarray: T[], func: (i: T) => Promise<any>): Promise<void> {
    let todo = [...inarray]
    if (todo.length > 0) {
        let i = todo.shift() as T
        await func(i)
        return array2promisechain(todo, func)
    }
    return
}
export function newdel_order(p: DBBase): number {
    if (p._isnew && p._isdeleted) {
        return 4 // Last but simplifies logic if I match first
    } else if (p._isdeleted) {
        return 1
    } else if (p._isnew) {
        return 2
    } else {
        return 3
    }
}
interface DBBase_with_name extends DBBase {
    name: string
}
export function cmp_pms(a: DBBase_with_name, b: DBBase_with_name): number {
    // -ve = a is BEFORE than b, 0 = equal, +ve = a is AFTER b
    let a1 = newdel_order(a)
    let b1 = newdel_order(b)
    let c1 = a1 - b1
    if (c1 !== 0)
        return c1
    return a.name.localeCompare(b.name)
}
export interface OwnershipInfo {
    isOwned: boolean | null
    isInstalled: boolean | null
    maxPrice: number | null
}
export function EditMapItem<K, T>(getter: Map<K, T>, setter: React.Dispatch<React.SetStateAction<Map<K, T>>>, index: K, updater: (v: T) => void) {
    const newthing = new Map<K, T>(getter)
    const item = newthing.get(index)
    if (item !== undefined) {
        updater(item)
        newthing.set(index, item)
    }
    setter(newthing)
}

export function safeEffect<T = void>(isMounted: boolean, set: () => T): T | void {
    if (isMounted)
        return set()
}

export function safeState<T>(isMounted: boolean, set: React.Dispatch<React.SetStateAction<T>>, value: React.SetStateAction<T>): void {
    safeEffect(isMounted, () => set(value))
}

export function devMode(): boolean {
    return process.env["NODE_ENV"] === "development"
}

export type FinishedCallback = () => void

export type DataUpdateCallback<Ev extends React.SyntheticEvent, Dt> = (e: Ev, data: Dt, finished: FinishedCallback) => void

export type ChangeUpdateCallback<El extends Element, Dt> = DataUpdateCallback<React.ChangeEvent<El>, Dt>
export type SelectChangeUpdateCallback<Dt> = ChangeUpdateCallback<HTMLSelectElement, Dt>
export type InputChangeUpdateCallback<Dt> = ChangeUpdateCallback<HTMLInputElement, Dt>

export type ClickUpdateCallback<El extends Element, Dt> = DataUpdateCallback<React.MouseEvent<El>, Dt>
export type ButtonClickUpdateCallback<Dt> = ClickUpdateCallback<HTMLButtonElement, Dt>

export type cssClassType = string | Set<string>

export function joinSet<T>(inset: Set<T>, ...toadd: T[]): Set<T> {
    const outset = new Set(inset)
    for (const item of toadd) {
        outset.add(item)
    }
    return outset
}

export function isString(input?: any): input is string {
    if (input === undefined || input === null)
        return false
    if ((input as string).match)
        return true
    return false
}

export function isSet<T = any>(input?: any): input is Set<T> {
    if (input === undefined || input === null)
        return false
    if ((input as Set<T>).has && (input as Set<T>).forEach)
        return true
    return false
}

export function iterator2Array<T>(input: IterableIterator<T>): T[] {
    return Array.from(input)
}

export function iteratorJoin<T>(input: IterableIterator<T>, sep?: string): string {
    return iterator2Array(input).join(sep)
}

export function joinClasses(left: cssClassType, ...right: cssClassType[]) {
    if (right.length <= 0)
        return left
    let out: Set<string>
    if (isSet(left))
        out = new Set<string>(left)
    else {
        out = new Set<string>()
        out.add(left)
    }
    for (const item of right) {
        if (item === undefined) {
            // Skip
        } else if (isSet(item)) {
            item.forEach(i => out.add(i))
        } else {
            out.add(item)
        }
    }
    return out
}

export function buildClasses(input?: cssClassType, ...more: cssClassType[]): string | undefined {
    if (input === undefined && more.length <= 0)
        return undefined
    if (input === undefined)
        return buildClasses(...more)
    if (more.length > 0)
        return buildClasses(joinClasses(input, ...more))
    if (isSet(input))
        return iteratorJoin(input.values(), " ")
    return input as string
}
