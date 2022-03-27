//             <div><label htmlFor="login_username">Username</label><input id="login_username" ref={this.userRef} type="text" name="username" placeholder='Username' /></div>

import { ForwardedRef, forwardRef } from "react"

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
}

const LabelInput = forwardRef(function (props: LIProps, ref: ForwardedRef<HTMLInputElement>) {
    return <div>
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
        />
    </div>
})

export default LabelInput