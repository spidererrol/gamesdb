import { NavLink, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function Admin(props: GeneralProps) {
    return <>
        <nav>
            <ul>
                <li><NavLink to="regtokens">Registration Tokens</NavLink></li>
            </ul>
        </nav>
        <Outlet />
    </>
}

export default Admin