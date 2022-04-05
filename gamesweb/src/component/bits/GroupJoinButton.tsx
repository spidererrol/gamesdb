import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupJoinButton(props: ButtonProps) {
    return <GenericButton maintype="GroupJoinButton" {...props}>
        <TextIcon text="Join" icon={faArrowRightToBracket} {...props} />
    </GenericButton>
}

export default GroupJoinButton