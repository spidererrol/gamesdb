//             <div><label htmlFor="login_username">Username</label><input id="login_username" ref={this.userRef} type="text" name="username" placeholder='Username' /></div>

import { ChangeEventHandler, ForwardedRef, forwardRef, useCallback } from "react"
import { makeElements } from "../../libs/utils"
import { GeneralProps } from "../props/GeneralProps"

export interface OptionInfo {
    value?: string
    content: string
}

interface LSProps extends GeneralProps {
    id?: string
    name: string
    label: string
    placeholder?: string
    label_as_placeholder?: boolean
    selected?: string
    multiple?: boolean
    options: OptionInfo[]
    onChange?: ChangeEventHandler<HTMLSelectElement>
}

const LabelSelect = forwardRef(function (props: LSProps, ref: ForwardedRef<HTMLSelectElement>) {
    let options = makeElements(props.options, useCallback(o => <option key={o.value ?? o.content as string} value={o.value}>{o.content}</option>, []))
    return <div>
        <label htmlFor={props.id ?? props.name}>{props.label}</label>
        <select
            id={props.id ?? props.name}
            ref={ref}
            name={props.name}
            multiple={props.multiple}
            placeholder={(props.label_as_placeholder ?? false) ? props.label : props.placeholder}
            value={props.selected}
            onChange={props.onChange}
        >{options}</select>
    </div>
})

export default LabelSelect