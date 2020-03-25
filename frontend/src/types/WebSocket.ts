export type CardValue = 'not-voted' | 'coffee' | '1' | '3';

export interface WebSocketState {
    resultsVisible: boolean,
    votes: {
        [userId: string]: CardValue
    }
}

export interface WebSocketApi {
    state: WebSocketState,

    setVote(vote: CardValue): void
    revealVotes(): void,
    resetVotes(): void
}
