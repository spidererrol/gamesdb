import { DBBase } from "./DBBase"
import { OwnerType } from "./Owner"
import { VoteType } from "./Vote"
import { WhenWhoType } from "./WhenWho"

export interface GameType extends DBBase {
    name: string
    aliases: string[]
    tags: string[]
    maxPlayers: number
    minPlayers: number
    links: { [index: string]: string } // Map in the database, but object in the returned json.
    votes: VoteType[]
    owners: OwnerType[]
    added: WhenWhoType
    myVote: VoteType | null
    myOwner: OwnerType | null
}
