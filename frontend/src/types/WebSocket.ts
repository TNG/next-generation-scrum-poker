export type CardValue =
  | 'not-voted'
  | 'coffee'
  | '0'
  | '0.5'
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '20'
  | '40'
  | '100';

export interface WebSocketState {
  resultsVisible: boolean;
  votes: {
    [userId: string]: CardValue;
  };
}

export interface WebSocketApi {
  state: WebSocketState;
  loginData: null | { user: string; session: string };

  login(user: string, session: string): void;
  setVote(vote: CardValue): void;
  revealVotes(): void;
  resetVotes(): void;
}

export interface WebsocketMessage {
  type: string;
  payload?: unknown;
}

export interface StateMessage extends WebsocketMessage {
  type: 'state';
  payload: WebSocketState;
}
