import { faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupDelButton(props: ButtonProps) {
    return <GenericButton maintype="GroupDelButton" {...props}>
        <TextIcon text="Del" icon={faTrashCan} />
    </GenericButton>
}

export default GroupDelButton