import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"

function GroupInviteButton(props: ButtonProps) {
    return <GenericButton maintype="GroupInviteButton" content="Invite" {...props} />
}

export default GroupInviteButton