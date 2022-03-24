import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ELProps {
    href: string,
    display: string,
}

function ExtLink(props: ELProps) {
    return <div className="link"><a className="extlink" href={props.href}>{props.display}<FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></a></div>
}

export default ExtLink