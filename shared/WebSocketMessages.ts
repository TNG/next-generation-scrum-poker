// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';

export type CardValue =
  | typeof VOTE_OBSERVER
  | typeof VOTE_NOTE_VOTED
  | typeof VOTE_COFFEE
  | '?'
  | '∞'
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | '0'
  | '0.5'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '8'
  | '13'
  | '16'
  | '20'
  | '21'
  | '32'
  | '34'
  | '40'
  | '55'
  | '64'
  | '89'
  | '100'
  | '128';

export interface Votes {
  [userId: string]: CardValue;
}

export interface WebSocketState {
  resultsVisible: boolean;
  votes: Votes;
  scale: Array<CardValue>;
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

export interface SetScaleMessage {
  type: 'set-scale';
  payload: {
    scale: Array<CardValue>;
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

export type ServerMessage = StateMessage | NotLoggedInMessage;

export type ClientMessage =
  | LoginMessage
  | SetVoteMessage
  | SetScaleMessage
  | RevealVotesMessage
  | ResetVotesMessage
  | RemoveUsersNotVotedMessage;
