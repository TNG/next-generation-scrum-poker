import { CardValue, WebSocketState } from '../shared/WebSocketMessages';

export interface WebSocketApi {
  connected: boolean;
  state: WebSocketState;
  loginData: WebSocketLoginData;
  loggedIn: boolean;
  login(user: string, session: string): void;
  setVote(vote: CardValue): void;
  setScale(scale: Array<CardValue>): void;
  revealVotes(): void;
  resetVotes(): void;
  removeUsersNotVoted(): void;
}

export type WebSocketLoginData = { user: string; session: string };
