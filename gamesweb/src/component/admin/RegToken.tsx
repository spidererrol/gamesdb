import { NavLink } from "react-router-dom"
import { RegTokenType } from "../../libs/types/RegToken"
import Card from "../cards/Card"
import { GeneralProps } from "../props/GeneralProps"

interface RTProps extends GeneralProps {
    regtoken: RegTokenType
}

function RegToken(props: RTProps) {
    // const del = useCallback((e) => {
    //     e.preventDefault()
    // }, [])
    return <Card
        key={props.regtoken._id}
        className="token"
        // titleButtons={[<DelButton onClick={del} data={null} />]}
        header={<div className="name"><NavLink className="regtoken_link" to={"/regtoken=" + props.regtoken.token}>{props.regtoken.token}</NavLink></div>}
        {...props}
    >
        <div className="limit">{props.regtoken.registrations ?? "unlimited"}</div>
        <div className="expires">{props.regtoken.expires?.toString() ?? "forever"}</div>
    </Card>
}

export default RegToken