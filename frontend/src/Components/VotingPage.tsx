import sharedClasses from '../styles.module.css';
import { WebSocketApi } from '../types/WebSocket';
import { CardSelector } from './CardSelector';
import { ScaleSelector } from './ScaleSelector';
import classes from './VotingPage.module.css';
import { VotingStateDisplay } from './VotingStateDisplay';
import { connectToWebSocket } from './WebSocket';

const ProtoVotingPage = ({ socket }: { socket: WebSocketApi }) => (
  <div className={classes.votingPage}>
    <div className={sharedClasses.heading}>SELECT A CARD</div>
    <CardSelector />
    <button className={classes.revealButton} onClick={() => socket.revealVotes()}>
      Reveal Votes
    </button>
    <VotingStateDisplay />
    <button className={classes.button} onClick={() => socket.removeUsersNotVoted()}>
      Kick users without vote
    </button>
    <ScaleSelector />
  </div>
);

export const VotingPage = connectToWebSocket(ProtoVotingPage);
