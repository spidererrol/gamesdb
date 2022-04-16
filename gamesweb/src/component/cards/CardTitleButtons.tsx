import { className } from "../props/className"
import { children } from "../props/children"
import { buildClasses } from "../../libs/utils"
import { anyElements } from "../../libs/types/helpers"

interface CTBProps extends className, children {
}

function isList(input: any): input is any[] {
    if ((input as any[]).reverse)
        return true
    return false
}

function reverseChildren(children: anyElements): anyElements {
    if (isList(children)) {
        let copy = [...children] // .reverse() mutates so need a copy!
        return copy.reverse()
    }
    else
        return children
}

function CardTitleButtons(props: CTBProps) {
    return <div className={buildClasses(props.className, "CardTitleButtons")}>{reverseChildren(props.children)}</div>
}

export default CardTitleButtons