import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    loginName: String,
    crypt: String,
    displayName: String,
})

export const LoginSchema = new Schema({
    token: String,
    user: { type: 'ObjectId', ref: 'User' },
    expires: { type: Date, default: Date.now }
})

export enum Vote {
    Veto,
    Accept,
    Desire,
}

export const VoteSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User' },
    when: { type: 'Date', default: Date.now },
    vote: Number,
})

export const OwnerSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User' },
    ownedSince: Date,
    installedSince: Date,
    maxPrice: Number,

})
OwnerSchema.virtual('isOwned').get((): boolean =>
    (this as unknown as { ownedSince: Date }).ownedSince !== null
)
OwnerSchema.virtual('isInstalled').get((): boolean =>
    (this as unknown as { installedSince: Date }).installedSince !== null
)

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
    links: [{
        type: Map,
        of: String,
    }],
    votes: [VoteSchema],
    owners: [OwnerSchema],
})
GameSchema.virtual('voteState').get(() => {
    let votes = (this as unknown as { votes: [{ vote: Number }] }).votes;
    let count = votes.length;
    let vote: Vote;
    if (votes.filter(v => v.vote == Vote.Veto).length > 0) {
        vote = Vote.Veto;
    } else if (votes.filter(v => v.vote == Vote.Desire).length > 0) {
        vote = Vote.Desire;
    } else {
        vote = Vote.Accept;
    }
    return {
        count: count,
        vote: vote,
    };
})
GameSchema.virtual('ownedState').get(() => {
    let owners = (this as unknown as { owners: [{ isOwned: boolean, isInstalled: boolean, maxPrice: Number }] }).owners;
    let count = owners.length;
    let owned = owners.filter(o=>o.isOwned).length;
    let installed = owners.filter(o=>o.isInstalled).length;
    let minPrice = owners.reduce((a,b) => {
        if (a.maxPrice <= 0) return b;
        if (a.maxPrice < b.maxPrice) return a;
        return b;
    }).maxPrice;
    let state: Owned;
    if (owned < count) {
        state = Owned.Unowned;
    } else if (installed < owned) {
        state = Owned.Owned;
    } else {
        state = Owned.Installed;
    }
    return {
        count: count,
        state: state,
        maxPrice: minPrice,
    };
})