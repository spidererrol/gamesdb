import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { GeneralProps } from "./props/GeneralProps"

interface LayoutProps extends GeneralProps {
  user: any
  logoutfunc: React.MouseEventHandler<HTMLButtonElement>
}

function Layout(props: LayoutProps) {
  let admin = <></>
  if (props.myuser.get.isAdmin)
    admin = <li><NavLink to="/admin">Admin</NavLink></li>
  return (
    <div className="Layout">
      <header>
        <p>Welcome {props.user.get.displayName}</p>
        <nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/groups">Groups</NavLink></li>
            <li><NavLink to="/games">Games</NavLink></li>
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