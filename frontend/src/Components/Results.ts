import { html } from '../html.js';
import { WebSocketConsumer } from './WebSocket.js';
import { css } from '../css.js';

const styling = css`
  background: yellow;

  .button {
    color: red;
  }
`;

export const Results = () =>
  html`<${WebSocketConsumer}
    >${(value) =>
      html`<div className=${styling}>
        <button
          className="button"
          onClick=${() => {
            value.setVote('20');
          }}
        >
          We
        </button>
        got: ${JSON.stringify(value.state)}
      </div>`}<//
  >`;
