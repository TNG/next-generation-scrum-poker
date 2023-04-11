import { RefObject } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { generateId } from '../../../../shared/generateId';
import {
  ALT_TNG_LOGO,
  APP_NAME_FIRST,
  APP_NAME_SECOND,
  BUTTON_CONNECTING,
  BUTTON_LOGIN,
  LABEL_SESSION,
  LABEL_USERNAME,
  TNG_URL,
} from '../../constants';
import tngLogo from '../../img/tng.svg';
import { LegalNoticeContainer } from '../LegalNoticeContainer/LegalNoticeContainer';
import { RefreshSessionButton } from '../RefreshSessionButton/RefreshSessionButton';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './LoginPage.module.css';

// During server-side-rendering, window/history cannot be accessed
const isSSR = typeof window === 'undefined';

export const LoginPage = connectToWebSocket(({ socket }) => {
  const firstInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [user, setUser] = useState(socket.loginData.user);
  const [sessionId, setSessionId] = useState(getInitialSessionId);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <form
      class={classes.loginPage}
      onSubmit={(event) => {
        event.preventDefault();
        socket.login(user, sessionId);
      }}
    >
      {!!socket.logoutReason && (
        <span class={classes.warning} role="alert">
          {socket.logoutReason}
        </span>
      )}
      <div class={classes.heading}>
        {APP_NAME_FIRST}
        <br />
        {APP_NAME_SECOND}
      </div>
      <label for="user" class={classes.userLabel}>
        {LABEL_USERNAME}
      </label>
      <input
        id="user"
        type="text"
        value={user}
        ref={firstInputRef}
        class={classes.userInput}
        onInput={(event) => setUser((event.target as HTMLInputElement).value)}
      />
      <label for="session" class={classes.sessionLabel}>
        {LABEL_SESSION}
      </label>
      <div class={classes.sessionContainer}>
        <a id="session" href={sessionId && `?sessionId=${sessionId}`} class={classes.sessionLink}>
          {sessionId}
        </a>
        <RefreshSessionButton onClick={() => setSessionId(refreshSessionId())} />
      </div>
      <input
        type="submit"
        value={socket.connected ? BUTTON_LOGIN : BUTTON_CONNECTING}
        class={classes.submit}
        disabled={user.length === 0 || !socket.connected}
      />
      <a href={TNG_URL} target="_blank" class={classes.logo}>
        <img src={tngLogo} alt={ALT_TNG_LOGO} class={classes.logoImage} />
      </a>
      <div class={classes.legalNotice}>
        <LegalNoticeContainer />
      </div>
    </form>
  );
});

function refreshSessionId(): string {
  const sessionId = generateId(16);
  history.replaceState({}, 'Scrum Poker', `?sessionId=${sessionId}`);
  return sessionId;
}

function getInitialSessionId(): string {
  if (isSSR) {
    return '';
  }

  const sessionId = new URLSearchParams(window.location.search).get('sessionId') || '';
  if (sessionId.match(/^[a-zA-Z0-9]{16}$/i)) {
    return sessionId;
  }

  return refreshSessionId();
}
