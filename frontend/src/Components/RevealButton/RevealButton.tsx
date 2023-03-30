import { VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { Votes } from '../../../../shared/serverMessages';
import { BUTTON_CONNECTING, BUTTON_REVEAL_NOW, BUTTON_REVEAL_VOTES } from '../../constants';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './RevealButton.module.css';

interface NumberOfVotes {
  missing: number;
  voted: number;
}

const getNumberOfVotes = (votes: Votes): NumberOfVotes =>
  Object.values(votes).reduce(
    ({ missing, voted }, vote) => ({
      missing: vote === VOTE_NOTE_VOTED ? missing + 1 : missing,
      voted: [VOTE_NOTE_VOTED, VOTE_OBSERVER].includes(vote) ? voted : voted + 1,
    }),
    {
      missing: 0,
      voted: 0,
    }
  );

export const RevealButton = connectToWebSocket(
  ({
    socket: {
      revealVotes,
      state: { votes },
      connected,
    },
  }) => {
    const { missing, voted } = getNumberOfVotes(votes);

    return (
      <button
        data-testid="reveal-button"
        class={classes.revealButton}
        onClick={revealVotes}
        disabled={!connected || !voted}
      >
        {getButtonText({ connected, missing, voted })}
      </button>
    );
  }
);

function getButtonText({ connected, missing, voted }: { connected: boolean } & NumberOfVotes) {
  if (!connected) {
    return BUTTON_CONNECTING;
  }

  if (!voted) {
    return (
      <>
        <div class={classes.revealNowButtonInfo}>Waiting for votes...</div>
        {BUTTON_REVEAL_VOTES}
      </>
    );
  }

  if (missing) {
    return (
      <>
        <div class={classes.revealNowButtonInfo}>{missing} missing votes</div>
        {BUTTON_REVEAL_NOW}
      </>
    );
  }

  return BUTTON_REVEAL_VOTES;
}
