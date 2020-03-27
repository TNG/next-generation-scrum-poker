import { html } from '../html.js';
import { connectToWebSocket, WebSocketConsumer } from './WebSocket.js';
import { css } from '../css.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from './LoginPage.js';

const styling = css`
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
  }
  .td {
    padding 25px;
  }
  .th {
        color: ${TNG_BLUE};
        padding 25px;
  }
  .button {
    border: none;
    color: white;
    cursor: pointer;
    background: ${TNG_BLUE};
    ${BORDER_RADIUS}
    margin: 10px;
    height: 50px;
    width: 150px;
  }
`;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) =>
  html`<div className=${styling}>
    <div className="heading">RESULTS</div>
    <table className="table">
      <tr className="th">
        <th>Name</th>
        <th>Vote</th>
      </tr>
      ${socket.state.votes.map((userAndVote) => {
        const userName = Object.keys(userAndVote)[0];
        const userVote = userAndVote[userName];
        return html` <tr>
          <td>${Object.keys(userAndVote)[0]}</td>
          <td>${userVote}</td>
        </tr>`;
      })}
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
