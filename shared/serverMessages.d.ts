import { CardValue } from './cards';

export type Votes = Record<string, CardValue>;

export interface WebSocketState {
  resultsVisible: boolean;
  votes: Votes;
  scale: CardValue[];
  pendingConnections: string[];
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
