import css from '/web_modules/csz.js';
import * as React from '/web_modules/react.js';
import { ASSET_TNG_LOGO } from '../assets.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from '../styles.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { connectToWebSocket } from './WebSocket.js';
import { v4 as uuidv4 } from '/web_modules/uuid.js';

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
  const firstInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [user, setUser] = React.useState('');
  const path = window.location.pathname.slice(1);
  const sessionId = path.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  )
    ? path
    : uuidv4();

  React.useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <form
      className={styling}
      onSubmit={(event) => {
        event.preventDefault();
        history.pushState({}, 'Scrum Poker', `/${sessionId}`);
        socket.login(user, sessionId);
      }}
    >
      <div className="heading">
        NEXT GENERATION
        <br />
        SCRUM POKER
      </div>
      <label htmlFor="user" className="user-label">
        Name:
      </label>
      <input
        id="user"
        type="text"
        value={user}
        ref={firstInputRef}
        className="user-input"
        onChange={(event) => setUser(event.target.value)}
      />
      <label htmlFor="session" className="session-label">
        Session:
      </label>
      <input id="session" type="text" value={sessionId} className="session-input" disabled />
      <input type="submit" value="Login" className="submit" disabled={user.length === 0} />
      <img src={ASSET_TNG_LOGO} alt="TNG Logo" className="logo" />
    </form>
  );
};

export const LoginPage = connectToWebSocket(ProtoLoginPage);
