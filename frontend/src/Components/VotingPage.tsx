import sharedClasses from '../styles.module.css';
import { WebSocketApi } from '../types/WebSocket';
import { CardSelector } from './CardSelector';
import { ScaleSelector } from './ScaleSelector';
import classes from './VotingPage.module.css';
import { VotingStateDisplay } from './VotingStateDisplay';
import { connectToWebSocket } from './WebSocket';
import { BUTTON_KICK_NOT_VOTED, HEADING_SELECT_CARD } from '../constants';

const ProtoVotingPage = ({ socket }: { socket: WebSocketApi }) => (
  <div class={classes.votingPage}>
    <div class={sharedClasses.heading}>{HEADING_SELECT_CARD}</div>
    <CardSelector />
    <button class={classes.revealButton} onClick={() => socket.revealVotes()}>
      Reveal Votes
    </button>
    <VotingStateDisplay />
    <button class={classes.button} onClick={() => socket.removeUsersNotVoted()}>
      {BUTTON_KICK_NOT_VOTED}
    </button>
    <ScaleSelector />
  </div>
);

export const VotingPage = connectToWebSocket(ProtoVotingPage);
