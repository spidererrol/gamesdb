import { DBBase } from "./DBBase"
import { GameType } from "./Game"
import { GroupType } from "./Group"
import { PlayModeType } from "./PlayMode"
import { PlayModeProgressValues } from "./PlayModeProgressValues"

export interface PlayModeProgressType extends DBBase {
    playmode: PlayModeType,
    group: GroupType,
    progress: PlayModeProgressValues,
    voteState: {
        count: number
        vote_id: number
        vote: string
    }
    ownedState: {
        count: number
        state_id: number
        state: string
        maxPrice: number
    }
    game: GameType
}
