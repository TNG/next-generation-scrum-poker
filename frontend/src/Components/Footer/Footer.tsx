import { LABEL_SESSION, LABEL_USERNAME } from '../../constants';
import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';
import { LegalNoticeContainer } from '../LegalNoticeContainer/LegalNoticeContainer';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './Footer.module.css';

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
    <div className={classes.legalNotice}>
      <LegalNoticeContainer />
    </div>
  </footer>
));
