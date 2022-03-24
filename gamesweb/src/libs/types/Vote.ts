import { DBBase } from "./DBBase"
import { UserType } from "./User"

export interface VoteType extends DBBase {
    user: UserType
    when: Date
    vote: string
    vote_id: number | null
}

