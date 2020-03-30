import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { css } from '../css.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE } from './LoginPage.js';

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
    color: ${TNG_BLUE};
    font-size: 20px;
    text-align: center;
    line-height: 1.2;
  }
  
  .table {
    text-align: left;
    padding: 15px;
    border-width: 3px;
    border-style: solid;
    border-color: ${TNG_BLUE};
    ${BORDER_RADIUS};
    margin: 10px;
  }
  
  .header-row {
    color: ${TNG_BLUE};
    padding 25px;
  }
  
  .button {
    border: none;
    color: white;
    cursor: pointer;
    background: ${TNG_BLUE};
    ${BORDER_RADIUS}
    height: 50px;
    width: 150px;
  }
`;

function getSortedResultsArray(unsortedResults) {
    let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
    return dataArray.sort( compareVotes)
}

const compareVotes = (userAndVote1: [string, CardValue], userAndVote2: [string, CardValue]) => {

  const vote1 = userAndVote1[1];
  const vote2 = userAndVote2[1];

  if (isNaN(Number(vote1)) && !isNaN(Number(vote2))) return 1;
  else if (!isNaN(Number(vote1)) && isNaN(Number(vote2))) return -1;
  else if (isNaN(Number(vote1)) && isNaN(Number(vote2))) {
    if (vote1.toLowerCase() > vote2.toLowerCase()) return 1;
    if (vote1.toLowerCase() < vote2.toLowerCase()) return -1;
  } else {
    if (Number(vote1) > Number(vote2)) return 1;
    if (Number(vote1) < Number(vote2)) return -1;
  }

  const user1 = userAndVote1[0];
  const user2 = userAndVote2[0];
  return (user1 > user2) ? 1 : -1;
};

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) =>
  html`<div className=${styling}>
    <div className="heading">RESULTS</div>
    <table className="table">
      <thead>
        <tr className="header-row">
          <th>Name</th>
          <th>Vote</th>
        </tr>
      </thead>
      <tbody>
        ${getSortedResultsArray(socket.state.votes).map((userAndVote) => {
            return html`<tr key=${userAndVote[0]}>
            <td>${userAndVote[0]}</td>
            <td>${userAndVote[1]}</td>
          </tr>`;
        })}
      </tbody>
    </table>
    <button
      className="button"
      onClick=${() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
  </div>`;

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
