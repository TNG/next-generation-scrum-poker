import css from 'csz';
import { tableStyle } from '../styles.js';
import { Votes, WebSocketApi } from '../types/WebSocket.js';
import { NotVotedIcon } from './NotVotedIcon';
import { ObserverIcon } from './ObserverIcon';
import { VotedIcon } from './VotedIcon';
import { connectToWebSocket } from './WebSocket.js';

const votingStateDisplayStyle = css`,
  ${tableStyle}
`;

const getSortedVotingState = (votes: Votes) => {
  const votedUsers = Object.keys(votes).map((user) => ({
    user,
    voted: votes[user] !== 'not-voted',
    observer: votes[user] === 'observer',
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

const getClassName = (voted: boolean, observer: boolean) => {
  if (observer) {
    return 'observer';
  }
  if (voted) {
    return 'voted';
  }
  return 'not-voted';
};

const getIcon = (voted: boolean, observer: boolean) => {
  if (observer) {
    return <ObserverIcon />;
  }
  if (voted) {
    return <VotedIcon />;
  }
  return <NotVotedIcon />;
};

const ProtoVotingStateDisplay = ({ socket }: { socket: WebSocketApi }) => (
  <table className={votingStateDisplayStyle}>
    <thead>
      <tr className="header-row">
        <th>Name</th>
        <th>Voted</th>
      </tr>
    </thead>
    <tbody>
      {getSortedVotingState(socket.state.votes).map(({ user, voted, observer }) => {
        return (
          <tr key={user}>
            <td className={getClassName(voted, observer)}>{user}</td>
            <td className={getClassName(voted, observer)}>{getIcon(voted, observer)}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export const VotingStateDisplay = connectToWebSocket(ProtoVotingStateDisplay);
