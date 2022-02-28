import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { isKnown, log_debug } from '../libs/utils';
import { GameType, OwnerType, VoteType } from '../types/games';
mongoose.plugin(autopopulate);

//TODO: Add some sort of grouping so I can differentiate games available for Thur and Sun or just 2 player, etc.
// Add matching search utilties to take advatage of it.

export const UserSchema = new Schema({
    loginName: String,
    crypt: String,
    displayName: String,
    registered: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
}, {
    toJSON: {
        transform: (_doc, ret, _optoins) => {
            delete ret.crypt;
            return ret;
        }
    }
})

export const WhenWhoSchema = new Schema({
    when: { type: Date, default: Date.now },
    who: { type: 'ObjectId', ref: 'User', autopopulate: true },
})

export const LoginSchema = new Schema({
    token: String,
    user: { type: 'ObjectId', ref: 'User', autopopulate: true },
    expires: { type: Date, default: Date.now }
})

export enum Vote {
    Veto,
    Accept,
    Desire,
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
});
VoteSchema.virtual('vote')
    .get(function (this: any): string {
        log_debug(`Get vote`);
        let ret = Vote[this.vote_id as number];
        log_debug(`==${this.vote_id} => ${ret}`);
        return ret;
    })
    .set(function (this: any, v: number | string) {
        // let thisthis = JSON.stringify(this);
        // log_debug(`Set vote = ${v} on ${thisthis}`);
        if (typeof v === 'number') {
            if (!isKnown(Vote[v]))
                throw new Error("Invalid vote!");
            (this).vote_id = v;
        } else {
            let vote_id = Vote[v as keyof typeof Vote] as number;
            if (!isKnown(vote_id))
                throw new Error("Invalid vote!");
            (this).vote_id = vote_id;
        }
        log_debug(`==${(this).vote_id}`);
    });

export const OwnerSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User', autopopulate: true },
    ownedSince: Date,
    installedSince: Date,
    maxPrice: Number,

}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
OwnerSchema.virtual('isOwned').get(function (this: OwnerType) {
    return this.ownedSince !== null && this.ownedSince !== undefined;
});
OwnerSchema.virtual('isInstalled').get(function (this: OwnerType) {
    return this.installedSince !== null && this.installedSince !== undefined;
});

export enum Owned {
    Unowned,
    Owned,
    Installed,
}
export const GameSchema = new Schema({
    name: String,
    aliases: [String],
    tags: [String],
    maxPlayers: Number,
    links: {
        type: Map,
        of: String,
    },
    votes: [{ type: VoteSchema, autopopulate: true }],
    owners: [OwnerSchema],
    added: { type: WhenWhoSchema, autopopulate: true },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
GameSchema.virtual('voteState').get(function (this: GameType) {
    let votes = this.votes;
    let count = votes.length;
    let vote: Vote;
    if (votes.filter(v => v.vote_id == Vote.Veto).length > 0) {
        vote = Vote.Veto;
    } else if (votes.filter(v => v.vote_id == Vote.Desire).length > 0) {
        vote = Vote.Desire;
    } else {
        vote = Vote.Accept;
    }
    return {
        count: count,
        vote_id: vote,
        vote: Vote[vote],
    };
})
GameSchema.virtual('ownedState').get(function (this: GameType) {
    let owners = this.owners;
    let count = owners.length;
    let owned = owners.filter(o => o.isOwned).length;
    let installed = owners.filter(o => o.isInstalled).length;
    let minPrice: number | null = null;
    if (owners.length >= 1) {
        minPrice = owners.filter(o => !o.isOwned).reduce((a, b) => {
            if (a.maxPrice <= 0) return b;
            if (a.maxPrice < b.maxPrice) return a;
            return b;
        }).maxPrice;
    }
    let state: Owned;
    log_debug(`owned = ${owned}, count = ${count}, installed = ${installed}`);
    if (installed == count) {
        state = Owned.Installed;
    } else if (count == 0 || owned < count) {
        state = Owned.Unowned;
    } else if (installed < owned) {
        state = Owned.Owned;
    } else {
        state = Owned.Installed;
    }
    return {
        count: count,
        state_id: state,
        state: Owned[state],
        maxPrice: minPrice,
    };
})