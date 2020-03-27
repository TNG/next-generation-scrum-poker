import React from '../../node_modules/es-react/dev/react.js';
import { css } from '../css.js';
import { BORDER_RADIUS, TNG_BLUE } from '../styles.js';
import { WebSocketApi } from '../types/WebSocket.js';
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

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) =>
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
        {Object.keys(socket.state.votes).map((user) => {
          return <tr key={user}>
            <td>{user}</td>
            <td>{socket.state.votes[user]}</td>
          </tr>;
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
  </div>;

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
