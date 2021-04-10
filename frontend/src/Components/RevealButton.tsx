import { WebSocketApi } from '../types/WebSocket';
import classes from './RevealButton.module.css';
import { connectToWebSocket } from './WebSocket';
import { BUTTON_REVEAL_VOTES } from '../constants';

const ProtoRevealButton = ({ socket }: { socket: WebSocketApi }) => (
  <button class={classes.revealButton} onClick={() => socket.revealVotes()}>
    {BUTTON_REVEAL_VOTES}
  </button>
);

export const RevealButton = connectToWebSocket(ProtoRevealButton);
