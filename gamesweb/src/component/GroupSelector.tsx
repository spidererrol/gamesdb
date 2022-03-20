import React from "react"
import { Link } from "react-router-dom"
import { GroupType } from "../libs/types/Group"
import { GeneralProps } from "./props/GeneralProps"

interface GroupSelectorProps extends GeneralProps {

}

interface GroupSelectorState {
    memberships: any[]
}

class GroupSelector extends React.Component<GroupSelectorProps, GroupSelectorState> {
    state = { memberships: ["Loading..."] as any[] }

    componentDidMount() {
        console.log("Generating groups...")
        this.props.api.user.memberships().then((memberships: GroupType[]) => {
            let grouprender = []
            for (const group of memberships) {
                console.log("Group: " + group.name)
                let group_id = group._id.toString()
                let group_path = "/group/" + group_id
                let classes = "group"
                if (group.private)
                    classes += " private"
                else
                    classes += " public"
                grouprender.push(<div className={classes} key={group._id.toString()}>
                    <Link to={group_path}>
                        <div className="button">{group.name}</div>
                    </Link>
                </div>)
            }
            this.setState({ memberships: grouprender })
        })
    }

    render() {
        return (
            <div className="memberships">
                <div className="legend">Groups: </div>
                {this.state.memberships}
                <div className="group new">
                    <Link to="/groups/add">
                        <div className="button" title="Create a new Group">Add</div>
                    </Link>
                </div>
                <div className="group new">
                    <Link to="/groups/join">
                        <div className="button" title="Join a public Group">Join</div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default GroupSelector