import css from 'csz';
import * as React from 'react';
import { buttonStyle, headingStyle, tableStyle, TNG_GRAY } from '../../styles.js';
import { CardValue, Votes, WebSocketApi } from '../../types/WebSocket.js';
import { connectToWebSocket } from '../WebSocket.js';
import { compareVotes } from './compareVotes.js';
import { CoffeeIcon } from '../CoffeeIcon';
import { NotVotedIcon } from '../NotVotedIcon';
import { ObserverIcon } from '../ObserverIcon';

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
    fill: ${TNG_GRAY};
    text-align: center;
  }
  .voted-entry {
    text-align: center;
  }
  .name-entry {
    line-height: 26px;
  }
`;

const getSortedResultsArray = (unsortedResults: Votes) => {
  let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const getVote = (vote: CardValue) => {
  if (vote === 'coffee') {
    return <CoffeeIcon />;
  }
  if (vote === 'not-voted') {
    return <NotVotedIcon />;
  }
  if (vote === 'observer') {
    return <ObserverIcon />;
  }
  return vote;
};

const getClassName = (vote: CardValue) =>
  vote === 'not-voted' || vote === 'observer' ? 'not-voted-entry' : 'voted-entry';

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
              <td className={'name-entry'}>{userAndVote[0]}</td>
              <td className={getClassName(userAndVote[1])}>{getVote(userAndVote[1])}</td>
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
