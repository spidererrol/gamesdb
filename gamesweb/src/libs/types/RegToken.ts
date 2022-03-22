import { DBBase } from "./DBBase"

export interface RegTokenType extends DBBase {
    token: string,
    registrations?: number,
    expires?: Date,
}

