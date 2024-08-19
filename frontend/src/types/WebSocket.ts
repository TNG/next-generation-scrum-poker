import { CardValue } from '../../../shared/cards';
import { WebSocketState } from '../../../shared/serverMessages';

export interface WebSocketApi {
  connected: boolean;
  loggedIn: boolean;
  login(user: string, session: string): void;
  loginData: WebSocketLoginData;
  logoutReason: string | undefined;
  removeUser(user: string): void;
  resetVotes(): void;
  revealVotes(): void;
  setScale(scale: CardValue[]): void;
  setVote(vote: CardValue): void;
  state: WebSocketState;
}

export interface WebSocketLoginData {
  user: string;
  session: string;
}
