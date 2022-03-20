import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"

function GroupLeaveButton(props: ButtonProps) {
    return <GenericButton maintype="GroupLeaveButton" content="Leave" {...props} />
}

export default GroupLeaveButton