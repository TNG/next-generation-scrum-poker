import { html } from '../html.js';
import { connectToWebSocket, WebSocketConsumer } from './WebSocket.js';
import { css } from '../css.js';
import { WebSocketApi } from '../types/WebSocket.js';

const styling = css`
  background: yellow;

  .button {
    color: red;
  }
`;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) =>
  html`<div className=${styling}>
    <button
      className="button"
      onClick=${() => {
        socket.setVote('20');
      }}
    >
      We
    </button>
    got: ${JSON.stringify(socket.state)}
  </div>`;

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
