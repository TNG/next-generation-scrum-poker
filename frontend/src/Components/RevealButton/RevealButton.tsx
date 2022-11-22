import { VOTE_NOTE_VOTED } from '../../../../shared/cards';
import { Votes } from '../../../../shared/serverMessages';
import { BUTTON_CONNECTING, BUTTON_REVEAL_NOW, BUTTON_REVEAL_VOTES } from '../../constants';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './RevealButton.module.css';

const getNumberOfMissingVotes = (votes: Votes): number =>
  Object.values(votes).reduce((count, vote) => (vote === VOTE_NOTE_VOTED ? count + 1 : count), 0);

export const RevealButton = connectToWebSocket(
  ({
    socket: {
      revealVotes,
      state: { votes },
      connected,
    },
  }) => {
    return (
      <button class={classes.revealButton} onClick={revealVotes} disabled={!connected}>
        {getButtonText({ connected, votes })}
      </button>
    );
  }
);

function getButtonText({ connected, votes }: { connected: boolean; votes: Votes }) {
  if (!connected) {
    return BUTTON_CONNECTING;
  }

  const missingVotes = getNumberOfMissingVotes(votes);

  if (missingVotes) {
    return (
      <>
        <div class={classes.revealNowButtonInfo}>{missingVotes} missing votes</div>
        {BUTTON_REVEAL_NOW}
      </>
    );
  }

  return BUTTON_REVEAL_VOTES;
}
