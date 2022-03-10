import React from "react"
import { Link, Outlet } from "react-router-dom"
import { GeneralProps } from "./GeneralProps"

interface LayoutProps extends GeneralProps {
  user: any
}

interface LayoutState {
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  state = {}
  async logout() {
    await this.props.api.auth.logout()
    this.props.api.authtok = "none"
  }

  render() {
    return (
      <div className="Layout">
        <header>
          <p>Welcome {this.props.user.get.displayName}</p>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/moose">Test</Link></li>
            </ul>
          </nav>
        </header>
        <article>
          <Outlet />
        </article>
        <button onClick={(e) => this.logout()}>Logout</button>
      </div>

    )
  }
}

export default Layout