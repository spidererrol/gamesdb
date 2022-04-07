import { NavLink, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function GamesPage(props: GeneralProps) {
    return <>
            <nav>
            <ul>
                <li><NavLink end={true} to=".">List</NavLink></li>
                <li><NavLink to="add">Add</NavLink></li>
            </ul>
        </nav>

    <Outlet />
    </>;
}

export default GamesPage;