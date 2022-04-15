import { ForwardedRef, forwardRef, useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"
import ClearButton, { ButtonAction } from "./ClearButton"

interface LIProps {
    id?: string
    name?: string
    label: string
    placeholder?: string
    label_as_placeholder?: boolean
    type: string
    value?: string
    defaultChecked?: boolean
    min?: number
    max?: number
    inputClass?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onClear?: ButtonAction
    cleardata?: any
    inputTitle?: string
}

const LabelInput = forwardRef(function (props: LIProps, ref: ForwardedRef<HTMLInputElement>) {
    const [getButton, setButton] = useState<anyElement>(<></>)

    useEffect(() => {
        if (props.onClear !== undefined)
            setButton(<ClearButton onClick={props.onClear} data={props.cleardata} />)
    }, [props.cleardata, props.onClear])

    return <div className="LabelInput">
        <label htmlFor={props.id ?? props.name}>{props.label}</label>
        <input
            id={props.id ?? props.name}
            ref={ref}
            type={props.type}
            name={props.name}
            placeholder={(props.label_as_placeholder ?? false) ? props.label : props.placeholder}
            defaultValue={props.value}
            defaultChecked={props.defaultChecked}
            min={props.min}
            max={props.max}
            className={props.inputClass}
            onChange={props.onChange}
            title={props.inputTitle}
        />
        {getButton}
    </div>
})

export default LabelInput