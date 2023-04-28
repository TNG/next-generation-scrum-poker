import {
  COLUMN_KICK,
  COLUMN_NAME,
  COLUMN_VOTED,
  TOOLTIP_PENDING_CONNECTION,
} from '../../constants';
import sharedClasses from '../../styles.module.css';
import { WebSocketApi } from '../../types/WebSocket';
import { IconNotVoted } from '../IconNotVoted/IconNotVoted';
import { IconObserver } from '../IconObserver/IconObserver';
import { IconVoted } from '../IconVoted/IconVoted';
import { KickButton } from '../KickButton/KickButton';
import { UserState, getVotingState } from '../../helpers/getVotingState';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './VotingStateDisplay.module.css';

const getSortedVotingState = (socket: WebSocketApi): UserState[] => {
  return getVotingState(socket).sort((a, b) => {
    const rankA = getRank(a);
    const rankB = getRank(b);
    if (rankA === rankB) {
      return 0;
    }
    return rankA > rankB ? -1 : 1;
  });
};

const getRank = ({ observer, voted }: UserState) => {
  if (observer) {
    return -1;
  }
  if (voted) {
    return 0;
  }
  return 1;
};

const getClassName = ({ voted, observer, pendingConnection }: UserState) => {
  if (voted) {
    return classes.voted;
  }
  if (pendingConnection) {
    return classes.pendingConnection;
  }
  if (observer) {
    return classes.observer;
  }
  return classes.notVoted;
};

const getIcon = ({ voted, observer }: UserState) => {
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
        {getSortedVotingState(socket).map((userState) => {
          return (
            <tr key={userState.user} class={getClassName(userState)}>
              <td
                class={userState.pendingConnection ? classes.pendingConnection : undefined}
                title={userState.pendingConnection ? TOOLTIP_PENDING_CONNECTION : undefined}
              >
                {userState.user}
              </td>
              <td>{getIcon(userState)}</td>
              <td>
                <KickButton user={userState.user} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
));
