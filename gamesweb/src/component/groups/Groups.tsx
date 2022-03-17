import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "../GeneralProps"

function Groups(props: GeneralProps) {
    return <>
        <nav>
            <ul>
                <li><Link to="/groups">List</Link></li>
                <li><Link to="/groups/add">Add</Link></li>
            </ul>
        </nav>
        <Outlet />
    </>
}

export default Groups