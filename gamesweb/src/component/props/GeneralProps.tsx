import { gamesapi } from "../../libs/gamesapi"
import StateObj from "../../libs/StateObj"

export interface GeneralProps {
    api: gamesapi
    myuser: StateObj<any>
    dbupdates: any
    dbupdate: Function
}
