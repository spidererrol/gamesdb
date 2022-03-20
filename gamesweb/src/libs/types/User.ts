import { DBBase } from "./DBBase"

export interface UserType extends DBBase {
    loginName: string
    displayName: string
    registered: Date
    isAdmin: boolean
}
