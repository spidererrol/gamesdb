import { NMap } from "./NMap"

export interface ILink {
    name: string
    url: string
}
export type NLMap = NMap<ILink>

export function newNLMap(clone?: NLMap): NLMap {
    return new Map<number, ILink>(clone)
}
