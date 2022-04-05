import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface TIProps {
    text: string,
    icon: IconProp
}

function TextIcon(props: TIProps) {
    return <>{props.text} <FontAwesomeIcon icon={props.icon} /></>
}

export default TextIcon