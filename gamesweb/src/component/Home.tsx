import React from "react"
import { GeneralProps } from "./props/GeneralProps"
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
                <GroupSelector {...this.props} />
            </div>
        )
    }
}

export default Home