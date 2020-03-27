import { html } from '../html.js';
import { connectToWebSocket, WebSocketConsumer } from './WebSocket.js';
import { css } from '../css.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from './LoginPage.js';

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
    var dataArray = Object.entries(unsortedResults)
    const noNumbers = ["not-voted","coffee"];
    return dataArray.sort( function (vote1, vote2) {
        // put not-voted last, wait if both are equal
        if (vote1[1] == "not-voted" && vote2[1] != "not-voted") return 1;
        if (vote1[1] != "not-voted" && vote2[1] == "not-voted") return -1;

        // put coffee after all numbers but before not-voted, wait if both are equal
        if (vote1[1] == "coffee" && vote2[1] != "coffee") return 1;
        if (vote1[1] != "coffee" && vote2[1] == "coffee") return -1;

        // sort numbers
        if (Number(vote1[1]) > Number(vote2[1])) return 1;
        if (Number(vote1[1]) < Number(vote2[1])) return -1;

        // for two equal votes, sort by name of user
        if (vote1[0] > vote2[0]) return 1;
        if (vote1[0] < vote2[0]) return -1;
    })
}

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
      getSortedResultsArray(socket.state.votes);
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
