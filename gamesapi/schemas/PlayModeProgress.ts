import { Schema } from 'mongoose'
import { isKnown, log_debug } from '../libs/utils'
import { GameGroup, PlayModeProgress, UserGroup } from '../models/games'
import { DBBase } from '../types/DBBase'
import { HTTPSTATUS } from '../types/httpstatus'
import { Owned } from '../types/Owned'
import { PlayModeProgressValues } from '../types/PlayModeProgressValues'
import { Vote } from '../types/Vote'
import { GameType } from './Game'
import { GameGroupType } from './GameGroup'
import { GroupType } from './Group'
import { PlayModeSchema, PlayModeType } from './PlayMode'

export interface PlayModeProgressType extends DBBase {
    playmode: PlayModeType,
    group: GroupType,
    progress: PlayModeProgressValues,
    voteState: {
        count: number
        vote_id: Vote
        vote: string
    }
    ownedState: {
        count: number
        state_id: Owned
        state: string
        maxPrice: number
    }
    game: GameType
}

export const PlayModeProgressSchema = new Schema({
    playmode: { type: 'ObjectId', ref: 'PlayMode', autopopulate: true },
    group: { type: 'ObjectId', ref: 'Group', autopopulate: false }, // I only expect to be retrieving this when I already know the group
    progress: { type: String, default: "Unplayed" },
})
PlayModeProgressSchema.virtual('game').get(function (this: PlayModeProgressType) {
    // Reminder: no need to turn on virtual output for this because playmode is already expanded and this is just lazy.
    return this.playmode.game
})
PlayModeProgressSchema.methods.voteState = async function (this: PlayModeProgressType) {
    let ug_members = await UserGroup.find({ group: this.group })
    let member_ids = ug_members.map(ug => ug.user._id.toString())
    let votes = this.playmode.votes.filter(v => member_ids.includes(v.user._id.toString()))
    let outvote: Vote | null = null
    for (const vote of votes) {
        if (vote.vote_id == Vote.Veto) {
            outvote = Vote.Veto
            break // No need to go further - this superceeds all others.
        }
        if (vote.vote_id == Vote.Desire) { // Veto would have already quit so must be Desire or Accept.
            outvote = Vote.Desire
        }
        if (outvote != Vote.Desire && vote.vote_id == Vote.Accept) {
            outvote = Vote.Accept
        }
    }
    if (outvote == null) {
        return {
            count: votes.length,
            vote_id: null,
            vote: "Unknown",
        }
    }
    return {
        count: votes.length,
        vote_id: outvote,
        vote: Vote[outvote],
    }
}
PlayModeProgressSchema.methods.ownedState = async function (this: PlayModeProgressType) {
    if (this.playmode.included) {
        let gg = await GameGroup.findOne({ group: this.group, game: this.game })

        if (!isKnown(gg)) {
            return {
                count: 0,
                state_id: Owned.Unowned,
                state: Owned[Owned.Unowned],
                maxPrice: null,
                error: `No GameGroup for game=${this.game} group=${this.group}`,
            }
        }
        let os = await gg.ownedState()
        os = {...os}
        os.maxPrice = 0.0
        return os
    }
    let ug_members = await UserGroup.find({ group: this.group })
    let member_ids = ug_members.map(ug => ug.user._id.toString())
    let owners = this.playmode.owners.filter(o => member_ids.includes(o.user._id.toString()))
    let outowned: Owned | null = null
    let maxPrice: number | null = null
    for (const owner of owners) {
        if (!owner.isOwned) {
            outowned = Owned.Unowned
            if (maxPrice == null || maxPrice > owner.maxPrice)
                maxPrice = owner.maxPrice
        }
        if (outowned != Owned.Unowned && !owner.isInstalled)
            outowned = Owned.Owned
        if (outowned != Owned.Unowned && outowned != Owned.Owned && owner.isInstalled)
            outowned = Owned.Installed
    }
    if (outowned == null) {
        return {
            count: owners.length,
            state_id: Owned.Unowned,
            state: Owned[Owned.Unowned],
            maxPrice: maxPrice,
        }
    }
    return {
        count: owners.length,
        state_id: outowned,
        state: Owned[outowned],
        maxPrice: maxPrice,
    }
}
