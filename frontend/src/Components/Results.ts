import {html} from "../html.js";
import {WebSocketConsumer} from "./WebSocket.js";
import {css} from "../css.js";

const styling=css`
  background: yellow;
  
  .button {
    color: red
  }
`;

export const Results = () => html`<${WebSocketConsumer}>${
    value => html`<div className=${styling}><span className="button">We</span> got: ${JSON.stringify(value.state)}</div>`
}<//>`;
