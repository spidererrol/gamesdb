import React from "react"
import { GeneralProps } from "./GeneralProps"
import GroupSelector from "./GroupSelector"

interface HomeState {

}

class Home extends React.Component<GeneralProps, HomeState> {
    state = {}
    render() {
        return (
            <div className="home">
                <GroupSelector api={this.props.api} />
            </div>
        )
    }
}

export default Home