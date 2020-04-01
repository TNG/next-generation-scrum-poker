import css from '/web_modules/csz.js';
import React from '/web_modules/react.js';
import { buttonStyle, headingStyle, tableHeaderStyle, tableStyle, TNG_GRAY } from '../styles.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';
import { compareVotes } from './compareVotes.js';
import { connectToWebSocket } from './WebSocket.js';

const styling = css`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-content: center;
  justify-content: center;

  .heading {
    ${headingStyle};
  }
  .button {
    ${buttonStyle};
  }
  .table {
    ${tableStyle};
  }
  .header-row {
    ${tableHeaderStyle};
  }
  .not-voted-entry {
    color: ${TNG_GRAY};
  }
`;

const getSortedResultsArray = (unsortedResults) => {
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
              <td className={userAndVote[1] === 'not-voted' && 'not-voted-entry'}>
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
