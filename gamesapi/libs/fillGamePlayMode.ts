import { Request } from 'express'
import { isKnown } from './utils'
import { GameType } from "../schemas/Game"
import { PlayModeType } from '../schemas/PlayMode'

// Helper functions:
export function fillGamePlayMode<T extends GameType | PlayModeType>(g: T, req: Request): T {
    let gout: any = { ...g.toObject() }
    // console.log("Thing is " + g.name)
    // console.dir(g.votes.map(v=>v.toObject()))
    let myvotes = g.votes.filter((v: any) => v.user._id == req.myUser._id.toString())
    if (myvotes.length >= 1) {
        gout.myVote = myvotes[0]
        gout.myVote.user = undefined
    } else {
        gout.myVote = {
            vote: "Unknown",
            vote_id: null,
        }
    }
    let myowners = g.owners.filter((o: any) => o.user._id == req.myUser._id.toString())
    if (myowners.length >= 1) {
        gout.myOwner = myowners[0]
        gout.myOwner.user = undefined
    } else {
        gout.myOwner = {
            maxPrice: null,
            isOwned: null,
            isInstalled: null,
        }
    }
    let linksobj: any = {}
    if (isKnown((g as any).links)) {
        for (const [k, v] of (g as GameType).links) {
            linksobj[k] = v
        }
        gout.links = linksobj
    }
    return gout
}
