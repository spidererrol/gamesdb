import { DBBase } from "./DBBase"
import { UserType } from "./User"

export interface OwnerType extends DBBase {
    user: UserType
    ownedSince?: Date
    installedSince?: Date
    maxPrice: number | null
    isOwned: boolean | null
    isInstalled: boolean | null
}

