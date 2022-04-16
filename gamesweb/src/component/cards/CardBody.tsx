import { buildClasses } from "../../libs/utils"
import { children } from "../props/children"
import { className } from "../props/className"

interface CBProps extends className, children {
}

function CardBody(props: CBProps) {
    return <div className={buildClasses(props.className, "CardBody")}>{props.children}</div>
}

export default CardBody