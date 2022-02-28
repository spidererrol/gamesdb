import { Vote, Owned } from '../schemas/games'
export { Vote, Owned };

interface DBBase {
    _id: string,
}

export interface UserType extends DBBase {
    loginName: string,
    crypt: string,
    displayName: string,
    registered: Date,
    isAdmin: boolean,
};

export interface LoginType extends DBBase {
    token: string,
    user: UserType,
    expires: Date,
};

export interface VoteType extends DBBase {
    user: UserType,
    when: Date,
    vote: string,
    vote_id: number,
};

export interface OwnerType extends DBBase {
    user: UserType
    ownedSince: Date,
    installedSince: Date,
    maxPrice: number,
    isOwned: boolean,
     isInstalled: boolean,
};

export interface GameType extends DBBase {
    name: string,
    aliases: string[],
    tags: string[],
    maxPlayers: number,
    links: {},
    votes: VoteType[],
    owners: OwnerType[],
    voteState: {
        count: number,
        vote: Vote,
    },
    ownedState: {
        count: number,
        state: Owned,
        maxPrice: number,
    },
};
