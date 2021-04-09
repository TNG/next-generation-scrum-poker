import { WebSocketApi } from '../types/WebSocket';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import classes from './Footer.module.css';
import { connectToWebSocket } from './WebSocket';

export const ProtoLoginInfo = ({ socket }: { socket: WebSocketApi }) => (
  <footer class={classes.footer}>
    <div class={classes.sessionInfo}>
      <span class={classes.infoItem}>
        Session ID: {socket.loginData ? socket.loginData.session : 'not found'}
      </span>
      <wbr />
      <span class={classes.infoItem}>
        User name: {socket.loginData ? socket.loginData.user : 'not found'}
      </span>
    </div>
    <CopyToClipboardButton />
  </footer>
);

export const Footer = connectToWebSocket(ProtoLoginInfo);
