import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"

function GroupDelButton(props: ButtonProps) {
    return <GenericButton maintype="GroupDelButton" content="Del" {...props} />
}

export default GroupDelButton