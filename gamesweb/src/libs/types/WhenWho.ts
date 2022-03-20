import { DBBase } from "./DBBase"
import { UserType } from "./User"

export interface WhenWhoType extends DBBase {
    when: Date
    who: UserType
}
