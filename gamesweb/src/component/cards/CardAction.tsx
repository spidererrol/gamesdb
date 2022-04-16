import { buildClasses } from "../../libs/utils"
import { children } from "../props/children"
import { className } from "../props/className"

interface CAProps extends className, children {
}

function CardAction(props: CAProps) {
    return <div className={buildClasses(props.className, "CardAction")}>{props.children}</div>
}

export default CardAction