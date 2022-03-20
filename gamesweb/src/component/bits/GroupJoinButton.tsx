import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"

function GroupJoinButton(props: ButtonProps) {
    return <GenericButton maintype="GroupJoinButton" content="Join" {...props} />
}

export default GroupJoinButton