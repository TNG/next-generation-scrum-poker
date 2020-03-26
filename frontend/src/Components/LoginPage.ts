import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { WebSocketApi } from '../types/WebSocket.js';
import React from '../../node_modules/es-react/dev/react.js';
import { css } from '../css.js';

const BORDER_RADIUS = 'border-radius: 5px;';
const TNG_BLUE = 'rgb(5,99,165)';
const TNG_GRAY = 'rgb(161,166,174)';

const styling = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: auto 100px;
  grid-template-rows: 44px 30px 30px 30px 30px;
  align-content: center;
  justify-content: center;
  grid-gap: 10px;

  .heading {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    color: ${TNG_BLUE};
    font-size: 20px;
    text-align: center;
    line-height: 1.2;
  }

  .logo {
    grid-column: 1 / 3;
    grid-row: 5 / 6;
    height: 30px;
  }

  .user-label {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    align-self: center;
    justify-self: end;
  }

  .user-input {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    padding: 0px 5px;
    ${BORDER_RADIUS};
  }

  .session-label {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    align-self: center;
    justify-self: end;
  }

  .session-input {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
    padding: 0px 5px;
    ${BORDER_RADIUS};
  }

  .submit {
    grid-column: 1 / 3;
    grid-row: 4 / 5;
    border: none;
    cursor: pointer;
    background: ${TNG_BLUE};
    color: white;
    ${BORDER_RADIUS}

    &:disabled {
      background: ${TNG_GRAY};
    }
  }
`;

const ProtoLoginPage = ({ socket }: { socket: WebSocketApi }) => {
  const firstInputRef = React.useRef(null);
  const [user, setUser] = React.useState('');
  const [session, setSession] = React.useState('');
  React.useEffect(() => firstInputRef.current.focus(), []);

  return html`<form
    className=${styling}
    onSubmit=${(event) => {
      event.preventDefault();
      socket.login(user, session);
    }}
  >
    <div className="heading">NEXT GENERATION<br />SCRUM POKER</div>
    <label htmlFor="user" className="user-label">Name:</label>
    <input
      id="user"
      type="text"
      value=${user}
      ref=${firstInputRef}
      className="user-input"
      onChange=${(event) => setUser(event.target.value)}
    />
    <label htmlFor="session" className="session-label">Session:</label>
    <input
      id="session"
      type="text"
      value=${session}
      className="session-input"
      onChange=${(event) => setSession(event.target.value)}
    />
    <input
      type="submit"
      value="Login"
      className="submit"
      disabled=${user.length === 0 || session.length < 2}
    />
    <img src="img/tng.svg" alt="TNG Logo" className="logo" />
  </form>`;
};

export const LoginPage = connectToWebSocket(ProtoLoginPage);
