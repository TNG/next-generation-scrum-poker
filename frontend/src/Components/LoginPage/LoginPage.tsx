import { RefObject } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import tngLogo from '../../img/tng.svg';
import { WebSocketApi } from '../../types/WebSocket';
import { connectToWebSocket } from '../WebSocket';
import { generateId } from './generateId';
import classes from './LoginPage.module.css';

const ProtoLoginPage = ({ socket }: { socket: WebSocketApi }) => {
  const firstInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [user, setUser] = useState(socket.loginData.user);
  let sessionId = new URLSearchParams(window.location.search).get('sessionId') || '';
  if (!sessionId.match(/^[a-zA-Z0-9]{16}$/i)) {
    sessionId = generateId(16);
    history.replaceState({}, 'Scrum Poker', `?sessionId=${sessionId}`);
  }

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <form
      className={classes.loginPage}
      onSubmit={(event) => {
        event.preventDefault();
        socket.login(user, sessionId);
      }}
    >
      <div className={classes.heading}>
        NEXT GENERATION
        <br />
        SCRUM POKER
      </div>
      <label htmlFor="user" className={classes.userLabel}>
        Name:
      </label>
      <input
        id="user"
        type="text"
        value={user}
        ref={firstInputRef}
        className={classes.userInput}
        onChange={(event) => setUser((event.target as HTMLInputElement).value)}
      />
      <label htmlFor="session" className={classes.sessionLabel}>
        Session:
      </label>
      <a id="session" href={`?sessionId=${sessionId}`} className={classes.sessionLink}>
        {sessionId}
      </a>
      <input type="submit" value="Login" className={classes.submit} disabled={user.length === 0} />
      <a href="https://www.tngtech.com/" target="_blank" className={classes.logo}>
        <img src={tngLogo} alt="TNG Logo" className={classes.logo} />
      </a>
    </form>
  );
};

export const LoginPage = connectToWebSocket(ProtoLoginPage);
