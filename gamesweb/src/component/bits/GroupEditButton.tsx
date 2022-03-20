import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"

function GroupEditButton(props: ButtonProps) {
    return <GenericButton maintype="GroupEditButton" content="Edit" {...props} />
}

export default GroupEditButton