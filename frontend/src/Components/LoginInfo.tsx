import css from 'csz';
import tngLogo from '../img/tng.svg';
import { TNG_GRAY } from '../styles';
import { WebSocketApi } from '../types/WebSocket';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { connectToWebSocket } from './WebSocket';

const loginInfoStyle = css`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  .heading {
    display: flex;
    align-items: initial;
    color: ${TNG_GRAY};
    font-size: 16px;
    line-height: 1.2;
  }

  .logo {
    height: 16px;
    margin-left: 8px;
  }

  .session-info {
    color: ${TNG_GRAY};
    font-size: 12px;
    margin-bottom: 0.5rem;
  }
`;

export const ProtoLoginInfo = ({ socket }: { socket: WebSocketApi }) => (
  <div className={loginInfoStyle}>
    <div className="heading">
      NEXT GENERATION SCRUM POKER
      <a href="https://www.tngtech.com/" target="_blank">
        <img src={tngLogo} alt="TNG Logo" className="logo" />
      </a>
    </div>
    <div className="session-info">
      Session ID: {socket.loginData ? socket.loginData.session : 'not found'} &nbsp; - &nbsp; User
      name: {socket.loginData ? socket.loginData.user : 'not found'}
    </div>
    <CopyToClipboardButton />
  </div>
);

export const LoginInfo = connectToWebSocket(ProtoLoginInfo);
