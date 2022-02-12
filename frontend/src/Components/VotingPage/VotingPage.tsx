import sharedClasses from '../../styles.module.css';
import { CardSelector } from '../CardSelector/CardSelector';
import { ScaleSelector } from '../ScaleSelector/ScaleSelector';
import classes from './VotingPage.module.css';
import { VotingStateDisplay } from '../VotingStateDisplay/VotingStateDisplay';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { BUTTON_KICK_NOT_VOTED, HEADING_SELECT_CARD } from '../../constants';
import { RevealButton } from '../RevealButton/RevealButton';

export const VotingPage = connectToWebSocket(({ socket }) => (
  <div class={classes.votingPage}>
    <div class={sharedClasses.heading}>{HEADING_SELECT_CARD}</div>
    <CardSelector />
    <RevealButton />
    <VotingStateDisplay />
    <button class={classes.button} onClick={() => socket.removeUsersNotVoted()}>
      {BUTTON_KICK_NOT_VOTED}
    </button>
    <ScaleSelector />
  </div>
));
