import { PlayModeProgressType } from "./PlayModeProgressType"
import { DBBase } from "./DBBase"
import { GameType } from "./Game"
import { OwnerType } from "./Owner"
import { VoteType } from "./Vote"

export interface PlayModeType extends DBBase {
    game: GameType
    name: string
    included: boolean
    description?: string
    votes: VoteType[]
    owners: OwnerType[]
    myVote: VoteType
    myOwner: OwnerType
}

export type { PlayModeProgressType }