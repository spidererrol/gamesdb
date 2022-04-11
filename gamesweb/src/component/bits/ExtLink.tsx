import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ELProps {
    href: string,
    display: string,
}

function ExtLink(props: ELProps) {
    return <div className="link"><a target="_blank" className="extlink" href={props.href} rel="noreferrer">{props.display}<FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></a></div>
}

export default ExtLink