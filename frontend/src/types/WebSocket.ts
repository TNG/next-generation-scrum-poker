export type CardValue =
  | 'not-voted'
  | '?'
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

export interface Votes {
  [userId: string]: CardValue;
}

export interface WebSocketState {
  resultsVisible: boolean;
  votes: Votes;
}

export interface WebSocketApi {
  state: WebSocketState;
  loginData: null | { user: string; session: string };

  login(user: string, session: string): void;
  setVote(vote: CardValue): void;
  revealVotes(): void;
  resetVotes(): void;
  removeUsersNotVoted(): void;
}

export interface StateMessage {
  type: 'state';
  payload: WebSocketState;
}

export interface NotLoggedInMessage {
  type: 'not-logged-in';
}

export interface LoginMessage {
  type: 'login';
  payload: {
    user: string;
    session: string;
  };
}

export interface SetVoteMessage {
  type: 'set-vote';
  payload: {
    vote: CardValue;
  };
}

export interface RevealVotesMessage {
  type: 'reveal-votes';
}

export interface ResetVotesMessage {
  type: 'reset-votes';
}

export interface RemoveUsersNotVotedMessage {
  type: 'remove-users-not-voted';
}

export type WebsocketMessage =
  | StateMessage
  | NotLoggedInMessage
  | LoginMessage
  | SetVoteMessage
  | RevealVotesMessage
  | ResetVotesMessage
  | RemoveUsersNotVotedMessage;

export type WebSocketLoginData = { user: string; session: string } | null;
