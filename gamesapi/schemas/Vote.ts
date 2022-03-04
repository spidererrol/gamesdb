import { Schema } from 'mongoose'
import '../libs/schemainit'
import { isKnown, log_debug } from '../libs/utils'
import { Vote } from '../types/Vote'
import { DBBase } from '../types/DBBase'
import { UserType } from './User'

export interface VoteType extends DBBase {
    user: UserType
    when: Date
    vote: string
    vote_id: number
}

export const VoteSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User', autopopulate: true },
    when: { type: 'Date', default: Date.now },
    vote_id: { type: Number },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
VoteSchema.virtual('vote')
    .get(function (this: any): string {
        log_debug(`Get vote`)
        let ret = Vote[this.vote_id as number]
        log_debug(`==${this.vote_id} => ${ret}`)
        return ret
    })
    .set(function (this: any, v: number | string) {
        // let thisthis = JSON.stringify(this);
        // log_debug(`Set vote = ${v} on ${thisthis}`);
        if (typeof v === 'number') {
            if (!isKnown(Vote[v]))
                throw new Error("Invalid vote!");
            (this).vote_id = v
        } else {
            let vote_id = Vote[v as keyof typeof Vote] as number
            if (!isKnown(vote_id))
                throw new Error("Invalid vote!");
            (this).vote_id = vote_id
        }
        log_debug(`==${(this).vote_id}`)
    })
