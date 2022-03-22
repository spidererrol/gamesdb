export type PagerFunction = (pageno: number, absolute: boolean) => void

export interface IPager {
    call: PagerFunction
    min: number
    current: number
    max?: number
}
