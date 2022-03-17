import React from "react"
import { GeneralProps } from "./GeneralProps"
import GroupSelector from "./GroupSelector"

interface HomeState {

}

class Home extends React.Component<GeneralProps, HomeState> {
    state = {}
    async logout() {
        await this.props.api.auth.logout()
        this.props.api.authtok = "none"
    }

    render() {
        return (
            <div className="home">
                <GroupSelector api={this.props.api} />
                <button onClick={(e) => this.logout()}>Logout</button>
            </div>
        )
    }
}

export default Home