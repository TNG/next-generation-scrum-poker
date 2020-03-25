import {html} from "../html.js";
import {WebSocketConsumer} from "./WebSocket.js";

export const Results = () => html`<${WebSocketConsumer}>${
    value => html`<div>We got: ${JSON.stringify(value.state)}</div>`
}<//>`;
