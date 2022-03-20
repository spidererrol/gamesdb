import { DBBase } from "./DBBase"

export interface RangeFilterType extends DBBase {
    above: number
    below: number
}
