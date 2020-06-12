import classnames from 'classnames';
import css from 'csz';
import * as React from 'react';
import { buttonStyle, headingStyle, tableStyle, TNG_GRAY } from '../../styles.js';
import { CardValue, Votes, WebSocketApi } from '../../types/WebSocket.js';
import { connectToWebSocket } from '../WebSocket.js';
import { compareVotes } from './compareVotes.js';

const styling = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  .heading {
    ${headingStyle}
  }
  .button {
    ${buttonStyle}
  }
  .table {
    ${tableStyle}
  }
  .not-voted-entry {
    color: ${TNG_GRAY};
  }
`;

const getSortedResultsArray = (unsortedResults: Votes) => {
  let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) => (
  <div className={styling}>
    <div className="heading">RESULTS</div>
    <table className="table">
      <thead>
        <tr className="header-row">
          <th>Name</th>
          <th>Vote</th>
        </tr>
      </thead>
      <tbody>
        {getSortedResultsArray(socket.state.votes).map((userAndVote) => {
          return (
            <tr key={userAndVote[0]}>
              <td>{userAndVote[0]}</td>
              <td className={classnames(userAndVote[1] === 'not-voted' && 'not-voted-entry')}>
                {userAndVote[1]}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <button
      className="button"
      onClick={() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
  </div>
);

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
