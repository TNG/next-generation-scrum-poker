import {html} from "../html.js";
import {WebSocketProvider} from "./WebSocket.js";
import {Results} from "./Results.js";

export const App = () => html`<${WebSocketProvider}><${Results}/><//>`;
