import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "../props/GeneralProps"

function GamesPage(props: GeneralProps) {
    return <>
            <nav>
            <ul>
                <li><Link to=".">List</Link></li>
                <li><Link to="add">Add</Link></li>
            </ul>
        </nav>

    <Outlet />
    </>;
}

export default GamesPage;