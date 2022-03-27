import { NMap } from "./NMap"

export type InputRef = React.RefObject<HTMLInputElement>

export type NRMap<T = HTMLInputElement> = NMap<React.RefObject<T>>

export function newNRMap<T = HTMLInputElement>(init?: any) {
    return new Map<number, React.RefObject<T>>(init)
}
