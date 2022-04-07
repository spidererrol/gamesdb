
export enum Vote {
    Veto,
    Accept,
    Desire,
    Dislike
}

export function VoteScore(vote: Vote) {
    switch (vote) {
        case Vote.Veto:
            return 1
        case Vote.Desire:
            return 2
        case Vote.Dislike:
            return 3
        case Vote.Accept:
            return 4
        default:
            throw new Error("Unknown Vote type!")
    }
}

function whichVote(prev: Vote, curr: Vote): Vote {
    return VoteScore(prev) > VoteScore(curr) ? curr : prev
}

export function BestVote(votes: Vote[]): Vote | undefined {
    if (votes.length <= 0)
        return undefined
    return votes.reduce(whichVote)
}