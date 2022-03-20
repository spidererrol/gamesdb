import { DBBase } from "./DBBase"
import { GameType } from "./Game"
import { RangeFilterType } from "./RangeFilter"
import { UserType } from "./User"
import { WhenWhoType } from "./WhenWho"

export interface GroupType extends DBBase {
    name: string,
    description: string,
    private: boolean,
    added: WhenWhoType,
    filters: {
        minPlayers: RangeFilterType,
        maxPlayers: RangeFilterType,
        includeTags: string[],
        excludeTags: string[],
    },
    members: UserType[], // Duplicates UserGroup but wanted for searching for private groups
    games: GameType[], // Duplicates GameGroup, don't know if I need it.

    isMember(user: UserType): boolean,
    includesGame(game: GameType): boolean,
    gameMatches(game: GameType): boolean,
}
