import { CardValue, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { WebSocketApi } from '../types/WebSocket';

export type UserState = {
  user: string;
  vote: CardValue;
  voted: boolean;
  observer: boolean;
  pendingConnection: boolean;
};

export const getVotingState = ({
  connected,
  loginData,
  state: { pendingConnections, votes },
}: Pick<WebSocketApi, 'connected' | 'loginData' | 'state'>): UserState[] => {
  return Object.keys(votes).map((user) => ({
    user,
    vote: votes[user],
    voted: votes[user] !== VOTE_NOTE_VOTED,
    observer: votes[user] === VOTE_OBSERVER,
    pendingConnection: pendingConnections.includes(user) || (!connected && user === loginData.user),
  }));
};
