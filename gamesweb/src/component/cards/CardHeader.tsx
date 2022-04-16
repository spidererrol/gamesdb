import { anyElements } from "../../libs/types/helpers"
import { buildClasses } from "../../libs/utils"
import MissingOk from "../bits/MissingOk"
import { children } from "../props/children"
import { className } from "../props/className"
import CardTitleButtons from "./CardTitleButtons"

interface CardHeaderProps extends className, children {
    titleButtons?: anyElements
}

function CardHeader(props: CardHeaderProps) {
    return <div className={buildClasses(props.className, "CardHeader")}>
        <MissingOk flagcontent={props.titleButtons} wrapper={CardTitleButtons}>{props.titleButtons}</MissingOk>
        <div className="CardHeader_Content">
            {props.children}
        </div>
    </div>
}

export default CardHeader