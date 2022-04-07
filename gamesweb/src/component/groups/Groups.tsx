import { NavLink, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function Groups(props: GeneralProps) {
    return <>
        <nav>
            <ul>
                <li><NavLink end={true} to="/groups">List</NavLink></li>
                <li><NavLink to="/groups/add">Add</NavLink></li>
            </ul>
        </nav>
        <Outlet />
    </>
}

export default Groups