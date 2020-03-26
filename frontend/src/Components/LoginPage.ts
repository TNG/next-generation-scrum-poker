import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { WebSocketApi } from '../types/WebSocket.js';
import React from '../../node_modules/es-react/dev/react.js';

const ProtoLoginPage = ({ socket }: { socket: WebSocketApi }) => {
  const [user, setUser] = React.useState('');
  const [session, setSession] = React.useState('');
  return html`<form>
    <div>
      <label htmlFor="user">Name:</label>
      <input
        id="user"
        type="text"
        value=${user}
        onChange=${(event) => setUser(event.target.value)}
      />
    </div>
    <div>
      <label htmlFor="session">Session:</label>
      <input
        id="session"
        type="text"
        value=${session}
        onChange=${(event) => setSession(event.target.value)}
      />
    </div>
    <div>
      <input type="submit" value="Login" onClick=${() => socket.login(user, session)} />
    </div>
  </form>`;
};

export const LoginPage = connectToWebSocket(ProtoLoginPage);
