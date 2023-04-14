import { VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { WebSocketState } from '../../../../shared/serverMessages';
import {
  COLUMN_KICK,
  COLUMN_NAME,
  COLUMN_VOTED,
  TOOLTIP_PENDING_CONNECTION,
} from '../../constants';
import sharedClasses from '../../styles.module.css';
import { IconNotVoted } from '../IconNotVoted/IconNotVoted';
import { IconObserver } from '../IconObserver/IconObserver';
import { IconVoted } from '../IconVoted/IconVoted';
import { KickButton } from '../KickButton/KickButton';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './VotingStateDisplay.module.css';

type UserState = {
  user: string;
  voted: boolean;
  observer: boolean;
  pendingConnection: boolean;
};

const getSortedVotingState = ({
  votes,
  pendingConnections,
}: Pick<WebSocketState, 'votes' | 'pendingConnections'>): UserState[] => {
  const votedUsers = Object.keys(votes).map((user) => ({
    user,
    voted: votes[user] !== VOTE_NOTE_VOTED,
    observer: votes[user] === VOTE_OBSERVER,
    pendingConnection: pendingConnections.includes(user),
  }));
  return votedUsers.sort((a, b) => {
    const rankA = getRank(a.voted, a.observer);
    const rankB = getRank(b.voted, b.observer);
    if (rankA === rankB) {
      return 0;
    }
    return rankA > rankB ? -1 : 1;
  });
};

const getRank = (voted: boolean, observer: boolean) => {
  if (observer) {
    return -1;
  }
  if (voted) {
    return 0;
  }
  return 1;
};

const getClassName = ({ voted, observer, pendingConnection }: Omit<UserState, 'user'>) => {
  if (pendingConnection) {
    return classes.pendingConnection;
  }
  if (observer) {
    return classes.observer;
  }
  if (voted) {
    return classes.voted;
  }
  return classes.notVoted;
};

const getIcon = ({ voted, observer }: Pick<UserState, 'voted' | 'observer'>) => {
  if (observer) {
    return <IconObserver />;
  }
  if (voted) {
    return <IconVoted />;
  }
  return <IconNotVoted />;
};

export const VotingStateDisplay = connectToWebSocket(({ socket }) => (
  <div class={sharedClasses.blueBorder}>
    <table class={sharedClasses.table}>
      <thead>
        <tr class={sharedClasses.headerRow}>
          <th>{COLUMN_NAME}</th>
          <th>{COLUMN_VOTED}</th>
          <th>{COLUMN_KICK}</th>
        </tr>
      </thead>
      <tbody>
        {getSortedVotingState(socket.state).map(({ user, voted, observer, pendingConnection }) => {
          return (
            <tr key={user} class={getClassName({ voted, observer, pendingConnection })}>
              <td title={pendingConnection ? TOOLTIP_PENDING_CONNECTION : undefined}>{user}</td>
              <td>{getIcon({ voted, observer })}</td>
              <td>
                <KickButton user={user} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
));
