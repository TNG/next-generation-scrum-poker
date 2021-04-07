import sharedClasses from '../styles.module.css';
import { Votes, WebSocketApi } from '../types/WebSocket';
import { NotVotedIcon } from './NotVotedIcon';
import { ObserverIcon } from './ObserverIcon';
import { VotedIcon } from './VotedIcon';
import classes from './VotingStateDisplay.module.css';
import { connectToWebSocket } from './WebSocket';

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
    return classes.observer;
  }
  if (voted) {
    return classes.voted;
  }
  return classes.notVoted;
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
  <div className={sharedClasses.blueBorder}>
    <table className={sharedClasses.table}>
      <thead>
        <tr className={sharedClasses.headerRow}>
          <th>Name</th>
          <th>Voted</th>
        </tr>
      </thead>
      <tbody>
        {getSortedVotingState(socket.state.votes).map(({ user, voted, observer }) => {
          return (
            <tr key={user} className={getClassName(voted, observer)}>
              <td>{user}</td>
              <td className={classes.votedIcon}>{getIcon(voted, observer)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const VotingStateDisplay = connectToWebSocket(ProtoVotingStateDisplay);
