import { anyElement, anyElementList } from "../../libs/types/helpers"
import { isKnown } from "../../libs/utils"
import { ButtonProps } from "../props/ButtonProps"

interface GenericButtonPropsBase extends ButtonProps {
    maintype: string,
}

interface GenericButtonPropsContent extends GenericButtonPropsBase {
    content: anyElement | string,
}
interface GenericButtonPropsChildren extends GenericButtonPropsBase {
    children: anyElementList | anyElement,
    content?: undefined
}

type GenericButtonProps = GenericButtonPropsContent | GenericButtonPropsChildren

/**
 * Either content or children must be specified but not both.
 * 
 * @param classes (optional) list of html classes
 * @param disabled (optional) is button disabled
 * @param onClick (optional) click event callback
 * @param maintype main className for button
 * @param content content of button
 * @param children content of button
 */
function GenericButton(inprops: GenericButtonProps) {
    let props: GenericButtonProps = { ...inprops }
    if (!isKnown(props.classes))
        props.classes = []
    props.classes?.push(props.maintype)
    return <button onClick={props.onClick} disabled={props.disabled} className={props.classes?.join(" ")}>{props.content ?? props.children}</button>
}

export default GenericButton