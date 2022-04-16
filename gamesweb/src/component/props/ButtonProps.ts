import { GeneralProps } from "./GeneralProps"

export interface ButtonProps extends GeneralProps {
    classes?: string[]
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}