import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "../props/ButtonProps"
import GenericButton from "./GenericButton"
import TextIcon from "./TextIcon"

function GroupViewButton(props: ButtonProps) {
    return <GenericButton maintype="GroupViewButton" {...props}><TextIcon text="View" icon={faMagnifyingGlass} /></GenericButton>
}

export default GroupViewButton