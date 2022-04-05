import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupInviteButton(props: ButtonProps) {
    return <GenericButton maintype="GroupInviteButton" {...props}>
        <TextIcon text="Invite" icon={faUserPlus} />
    </GenericButton>
}

export default GroupInviteButton