import { CopyToClipboardButton } from './CopyToClipboardButton';
import classes from './Footer.module.css';
import { connectToWebSocket } from './WebSocket';
import { LABEL_SESSION, LABEL_USERNAME } from '../constants';

export const Footer = connectToWebSocket(({ socket }) => (
  <footer class={classes.footer}>
    <div class={classes.sessionInfo}>
      <span class={classes.infoItem}>
        {LABEL_SESSION} {socket.loginData.session}
      </span>
      <wbr />
      <span class={classes.infoItem}>
        {LABEL_USERNAME} {socket.loginData.user}
      </span>
    </div>
    <CopyToClipboardButton />
  </footer>
));
