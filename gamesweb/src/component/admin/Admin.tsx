import { NavLink, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function Admin(props: GeneralProps) {
    return <>
        <nav>
            <ul>
                <li><NavLink to="." end={true}>Controls</NavLink></li>
                <li><NavLink to="regtokens">Registration Tokens</NavLink></li>
                <li><NavLink to="users">List Users</NavLink></li>
            </ul>
        </nav>
        <Outlet />
    </>
}

export default Admin