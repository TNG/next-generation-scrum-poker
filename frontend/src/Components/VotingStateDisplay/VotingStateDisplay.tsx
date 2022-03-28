import sharedClasses from '../../styles.module.css';
import { IconNotVoted } from '../IconNotVoted/IconNotVoted';
import { IconObserver } from '../IconObserver/IconObserver';
import { IconVoted } from '../IconVoted/IconVoted';
import classes from './VotingStateDisplay.module.css';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { COLUMN_NAME, COLUMN_VOTED } from '../../constants';
import { VOTE_OBSERVER, Votes } from '../../shared/WebSocketMessages';

const getSortedVotingState = (votes: Votes) => {
  const votedUsers = Object.keys(votes).map((user) => ({
    user,
    voted: votes[user] !== 'not-voted',
    observer: votes[user] === VOTE_OBSERVER,
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
        </tr>
      </thead>
      <tbody>
        {getSortedVotingState(socket.state.votes).map(({ user, voted, observer }) => {
          return (
            <tr key={user} class={getClassName(voted, observer)}>
              <td>{user}</td>
              <td>{getIcon(voted, observer)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
));
