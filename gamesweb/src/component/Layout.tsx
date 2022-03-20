import React from "react"
import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "./props/GeneralProps"

interface LayoutProps extends GeneralProps {
  user: any
  logoutfunc: React.MouseEventHandler<HTMLButtonElement>
}

interface LayoutState {
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  state = {}
  render() {
    return (
      <div className="Layout">
        <header>
          <p>Welcome {this.props.user.get.displayName}</p>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/groups">Groups</Link></li>
              <li className="last"><button className="logout" onClick={this.props.logoutfunc}>Logout</button></li>
            </ul>
          </nav>
        </header>
        <article>
          <Outlet />
        </article>
      </div>

    )
  }
}

export default Layout