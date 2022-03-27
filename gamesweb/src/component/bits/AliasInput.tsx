import { ForwardedRef, forwardRef } from "react"
import DelButton, { ButtonAction } from "./DelButton"

export type UpdateAction = (e:React.ChangeEvent<HTMLInputElement>,data: any) => void

interface AIProps {
    i: number,
    value: string,
    onInputChange:UpdateAction,
    onDelClick:ButtonAction
}

const AliasInput = forwardRef(function(props:AIProps,ref: ForwardedRef<HTMLInputElement>) {
    return <div key={props.i} className="alias"><input ref={ref} defaultValue={props.value} onChange={(e) => props.onInputChange(e, props.i)} /><DelButton onClick={props.onDelClick} data={props.i} /></div>;
})

export default AliasInput;