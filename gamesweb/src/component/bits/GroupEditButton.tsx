import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupEditButton(props: ButtonProps) {
    // return <GenericButton maintype="GroupEditButton" content="Edit" {...props} />
    return <GenericButton maintype="GroupEditButton" {...props}><TextIcon text="Edit" icon={faPenToSquare} /></GenericButton>
}

export default GroupEditButton