import css from '/web_modules/csz.js';
import * as React from '/web_modules/react.js';
import { tableStyle } from '../styles.js';
import { Votes, WebSocketApi } from '../types/WebSocket.js';
import { connectToWebSocket } from './WebSocket.js';

const votingStateDisplayStyle = css`
  ${tableStyle}
`;

const getSortedVotingState = (votes: Votes) => {
  const votedUsers = Object.keys(votes).map((user) => ({
    user,
    voted: votes[user] === 'not-voted',
  }));
  return votedUsers.sort((a) => (a.voted ? -1 : 1));
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
      {getSortedVotingState(socket.state.votes).map(({ user, voted }) => {
        return (
          <tr key={user}>
            <td className={voted ? 'voted' : 'not-voted'}>{user}</td>
            <td align="center" className={voted ? 'voted' : 'not-voted'}>
              {voted ? '✗' : '✔'}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export const VotingStateDisplay = connectToWebSocket(ProtoVotingStateDisplay);
