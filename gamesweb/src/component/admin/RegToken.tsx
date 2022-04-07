import { NavLink } from "react-router-dom"
import { RegTokenType } from "../../libs/types/RegToken"
import { GeneralProps } from "../props/GeneralProps"

interface RTProps extends GeneralProps {
    regtoken: RegTokenType
}

function RegToken(props: RTProps) {
    return <div key={props.regtoken._id} className="token">
        <div className="name"><NavLink className="regtoken_link" to={"/regtoken=" + props.regtoken.token}>{props.regtoken.token}</NavLink></div>
        <div className="limit">{props.regtoken.registrations ?? "unlimited"}</div>
        <div className="expires">{props.regtoken.expires?.toString() ?? "forever"}</div>
    </div>
}

export default RegToken