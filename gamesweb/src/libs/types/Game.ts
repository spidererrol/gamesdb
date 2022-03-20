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
    links: Map<string, string>//{ [index: string]: string }
    votes: VoteType[]
    owners: OwnerType[]
    added: WhenWhoType
}
