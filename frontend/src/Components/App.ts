import { html } from '../html.js';
import { WebSocketProvider } from './WebSocket.js';
import { PageSelector } from './PageSelector.js';

export const App = () => html`<${WebSocketProvider}><${PageSelector} /><//>`;
