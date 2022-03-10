import { useEffect, useState } from "react"
import { GameType } from "../libs/types/Game"
import { GameGroupType } from "../libs/types/GameGroup"
import { GeneralProps } from "./GeneralProps"

interface GGProps extends GeneralProps {
    groupid: string
    gameid: string
}

function GroupGame(props: GGProps) {
    const [dbplaymodes,setdbPlaymodes] = useState<any[]>([<div className="loading">Loading...</div>])
    const [game,setGame] = useState<GameType>({name:"Loading..."} as GameType)
    const [gamegroup,setGameGroup] = useState<GameGroupType[]>([])
    useEffect(() => {
        props.api.game.playmodes(props.gameid).then((p)=>setdbPlaymodes(()=>p))
        props.api.game.get(props.gameid).then((g)=>setGame(g))
        //FIXME: Need to get gamegroup (no current route) in order to get the group-only votes and ownership (because I don't care about non-members choices)
    },[props])
    useEffect(() => {

    },[dbplaymodes])
    return (<div className="GroupGame">{game.name}{props.gameid}</div>)
}

export default GroupGame