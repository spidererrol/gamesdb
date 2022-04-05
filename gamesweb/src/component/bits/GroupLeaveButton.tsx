import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupLeaveButton(props: ButtonProps) {
    return <GenericButton maintype="GroupLeaveButton" {...props}>
        <TextIcon text="Leave" icon={faArrowRightFromBracket} />
    </GenericButton>
}

export default GroupLeaveButton