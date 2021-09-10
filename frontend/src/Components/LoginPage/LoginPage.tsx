import { RefObject } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import tngLogo from '../../img/tng.svg';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { generateId } from './generateId';
import classes from './LoginPage.module.css';
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
import { PrivacyNoticeContainer } from '../PrivacyNoticeContainer/PrivacyNoticeContainer';

// During server-side-rendering, window/history cannot be accessed
const isSSR = typeof window === 'undefined';

export const LoginPage = connectToWebSocket(({ socket }) => {
  const firstInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [user, setUser] = useState(socket.loginData.user);
  let sessionId = '';
  if (!isSSR) {
    sessionId = new URLSearchParams(window.location.search).get('sessionId') || '';
    if (!sessionId.match(/^[a-zA-Z0-9]{16}$/i)) {
      sessionId = generateId(16);
      history.replaceState({}, 'Scrum Poker', `?sessionId=${sessionId}`);
    }
  }

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
      <a id="session" href={`?sessionId=${sessionId}`} class={classes.sessionLink}>
        {sessionId}
      </a>
      <input
        type="submit"
        value={socket.connected ? BUTTON_LOGIN : BUTTON_CONNECTING}
        class={classes.submit}
        disabled={user.length === 0 || !socket.connected}
      />
      <a href={TNG_URL} target="_blank" class={classes.logo}>
        <img src={tngLogo} alt={ALT_TNG_LOGO} class={classes.logoImage} />
      </a>
      <div class={classes.privacyNotice}>
        <PrivacyNoticeContainer />
      </div>
    </form>
  );
});
