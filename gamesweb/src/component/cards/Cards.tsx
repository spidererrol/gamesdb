import { anyElements } from "../../libs/types/helpers"
import { buildClasses, cssClassType } from "../../libs/utils"

interface CardsProps {
    className?: cssClassType
    children: anyElements
}

function Cards(props: CardsProps) {
    return <div className={buildClasses(props.className, "Cards")}>{props.children}</div>
}

export default Cards