import { ForwardedRef, forwardRef } from "react"
import { GeneralProps } from "../props/GeneralProps"

interface LTProps extends GeneralProps {
    id?: string
    name: string
    label: string
    placeholder?: string
    label_as_placeholder?: boolean
    value?: string
}

const LabelTextarea = forwardRef(function (props: LTProps, ref: ForwardedRef<HTMLTextAreaElement>) {
    return <div>
        <label htmlFor={props.id ?? props.name}>{props.label}</label>
        <textarea
            id={props.id ?? props.name}
            ref={ref}
            name={props.name}
            placeholder={(props.label_as_placeholder ?? false) ? props.label : props.placeholder}
            defaultValue={props.value}
        />
    </div>
})

export default LabelTextarea