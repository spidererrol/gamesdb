import { anyElement } from "../../libs/types/helpers"
import { isKnown } from "../../libs/utils"
import { ButtonProps } from "../props/ButtonProps"

interface GenericButtonProps extends ButtonProps {
    maintype: string,
    content: anyElement|string,
}

function GenericButton(inprops: GenericButtonProps) {
    let props: GenericButtonProps = { ...inprops }
    if (!isKnown(props.classes))
        props.classes = []
    props.classes?.push(props.maintype)
    return <button onClick={props.onClick} disabled={props.disabled} className={props.classes?.join(" ")}>{props.content}</button>
}

export default GenericButton