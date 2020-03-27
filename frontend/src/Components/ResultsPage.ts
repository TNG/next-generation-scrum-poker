import { html } from '../html.js';
import { connectToWebSocket, WebSocketConsumer } from './WebSocket.js';
import { css } from '../css.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from './LoginPage.js';


const styling = css`
  .table {
    text-align: left;
    padding: 15px;
  }
  .td {
    padding 25px;
  }
  .th {
        color: darkblue;
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
  .cardStyle = {
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 3px;
      border-style: solid;
      border-color: ${TNG_BLUE};
      border-radius: 10px;
      color: ${TNG_BLUE};
      margin: 10px;
   }
`;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) =>
  html`<div className=${styling}>
    <button
      className="button"
      onClick=${() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
    <div className="cardStyle">
    <table className="table">
        <tr className="th"> <th>Name</th> <th>Vote</th> </tr>
        ${socket.state.votes.map( (userAndVote) => {
            const userName = Object.keys(userAndVote)[0];
            const userVote = userAndVote[userName];
            return html`
                  <tr>
                      <td>${Object.keys(userAndVote)[0]} </td>
                      <td>${Object.values(userAndVote)[0]} </td>
                  </tr>`
        }
        )}
    </table>
    </div>
</div>`




export const ResultsPage = connectToWebSocket(ProtoResultsPage);
