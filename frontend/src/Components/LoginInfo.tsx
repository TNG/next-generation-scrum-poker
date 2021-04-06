import tngLogo from '../img/tng.svg';
import { WebSocketApi } from '../types/WebSocket';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import classes from './LoginInfo.module.css';
import { connectToWebSocket } from './WebSocket';

export const ProtoLoginInfo = ({ socket }: { socket: WebSocketApi }) => (
  <div className={classes.loginInfo}>
    <div className={classes.heading}>
      NEXT GENERATION SCRUM POKER
      <a href="https://www.tngtech.com/" target="_blank">
        <img src={tngLogo} alt="TNG Logo" className={classes.logo} />
      </a>
    </div>
    <div className={classes.sessionInfo}>
      Session ID: {socket.loginData ? socket.loginData.session : 'not found'} &nbsp; - &nbsp; User
      name: {socket.loginData ? socket.loginData.user : 'not found'}
    </div>
    <CopyToClipboardButton />
  </div>
);

export const LoginInfo = connectToWebSocket(ProtoLoginInfo);
