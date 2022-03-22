import React from "react"
import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "./props/GeneralProps"

interface LayoutProps extends GeneralProps {
  user: any
  logoutfunc: React.MouseEventHandler<HTMLButtonElement>
}

function Layout(props: LayoutProps) {
  let admin = <></>
  if (props.myuser.get.isAdmin)
    admin = <li><Link to="/admin">Admin</Link></li>
  return (
    <div className="Layout">
      <header>
        <p>Welcome {props.user.get.displayName}</p>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li className="gap"></li>
            {admin}
            <li>
              <button className="logout" onClick={props.logoutfunc}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      <article>
        <Outlet />
      </article>
    </div>

  )
}

export default Layout