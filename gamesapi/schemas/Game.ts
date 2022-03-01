import { Schema } from 'mongoose';
import { log_debug } from '../libs/utils';
import { VoteSchema } from "./Vote";
import { WhenWhoSchema } from './WhenWho';
import { Vote } from '../types/Vote';
import { OwnerSchema } from './Owner';
import { Owned } from '../types/Owned';
import { DBBase } from '../types/DBBase';
import { WhenWhoType } from './WhenWho';
import { VoteType } from './Vote';
import { OwnerType } from "./Owner";

export interface GameType extends DBBase {
    name: string;
    aliases: string[];
    tags: string[];
    maxPlayers: number;
    links: {};
    votes: VoteType[];
    owners: OwnerType[];
    voteState: {
        count: number;
        vote: Vote;
    };
    ownedState: {
        count: number;
        state: Owned;
        maxPrice: number;
    };
    added: WhenWhoType;
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
});
GameSchema.virtual('ownedState').get(function (this: GameType) {
    let owners = this.owners;
    let count = owners.length;
    let owned = owners.filter(o => o.isOwned).length;
    let installed = owners.filter(o => o.isInstalled).length;
    let minPrice: number | null = null;
    if (owners.length >= 1) {
        minPrice = owners.filter(o => !o.isOwned).reduce((a, b) => {
            if (a.maxPrice <= 0)
                return b;
            if (a.maxPrice < b.maxPrice)
                return a;
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
});
