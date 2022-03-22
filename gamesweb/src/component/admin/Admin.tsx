import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function Admin(props: GeneralProps) {
    return <>
        <nav>
            <ul>
                <li><Link to="regtokens">Registration Tokens</Link></li>
            </ul>
        </nav>
        <Outlet />
    </>
}

export default Admin