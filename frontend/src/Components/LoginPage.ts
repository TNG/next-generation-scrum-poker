import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { WebSocketApi } from '../types/WebSocket.js';

const ProtoLoginPage = ({ socket }: { socket: WebSocketApi }) => {
  return html`<button onClick=${() => socket.login('Frontend User', 'My Session')}>Login</button>`;
};

export const LoginPage = connectToWebSocket(ProtoLoginPage);
