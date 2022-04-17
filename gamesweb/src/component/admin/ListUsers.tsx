import { useState, useEffect } from "react"
import { anyElementList } from "../../libs/types/helpers"
import { UserType } from "../../libs/types/User"
import Loading from "../bits/Loading"
import Card from "../cards/Card"
import Cards from "../cards/Cards"
import { GeneralProps } from "../props/GeneralProps"

function ListUsers(props: GeneralProps) {
    const [getUsers, setUsers] = useState<UserType[]>([])
    const [getUserElems, setUserElems] = useState<anyElementList>([<Loading key="LOADING" caller="Admin/ListUsers" />])
    useEffect(() => {
        props.api.user.getAll().then(u => setUsers(u))
    }, [props.api.user])
    useEffect(() => {
        setUserElems(getUsers.map(u => <Card
            key={u._id}
            header={u.displayName}
            {...props}
        >
            <pre>{JSON.stringify(u, undefined, 2)}</pre>
        </Card>))
    }, [getUsers, props])
    return <fieldset>
        <legend>Users:</legend>
        <Cards>{getUserElems}</Cards>
    </fieldset>
}

export default ListUsers