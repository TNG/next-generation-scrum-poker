import { CardValue } from './cards';

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

export interface Reason {
  reason: string;
}

export interface NotLoggedInMessage {
  type: 'not-logged-in';
  payload: Reason;
}

export type ServerMessage = StateMessage | NotLoggedInMessage;
