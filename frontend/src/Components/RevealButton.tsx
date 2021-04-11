import { WebSocketApi } from '../types/WebSocket';
import classes from './RevealButton.module.css';
import { connectToWebSocket } from './WebSocket';
import { BUTTON_REVEAL_VOTES, VOTE_NOTE_VOTED } from '../constants';
import { useEffect, useState } from 'preact/hooks';

const ProtoRevealButton = ({
  socket: {
    revealVotes,
    state: { votes },
  },
}: {
  socket: WebSocketApi;
}) => {
  const [hasRequestedReveal, setHasRequestedReveal] = useState(false);
  useEffect(() => {
    if (hasRequestedReveal && Object.values(votes).every((vote) => vote !== VOTE_NOTE_VOTED)) {
      revealVotes();
    }
  }, [votes]);

  if (hasRequestedReveal) {
    const missingVotes = Object.values(votes).filter((vote) => vote === VOTE_NOTE_VOTED).length;
    return (
      <div class={classes.revealButtonContainer}>
        <div>{missingVotes} people did not vote</div>
        <button class={classes.revealNowButton} onClick={revealVotes}>
          Reveal Now
        </button>
      </div>
    );
  }
  return (
    <div class={classes.revealButtonContainer}>
      <button
        class={classes.revealButton}
        onClick={() => {
          if (Object.values(votes).some((vote) => vote === VOTE_NOTE_VOTED)) {
            setHasRequestedReveal(true);
          } else {
            revealVotes();
          }
        }}
      >
        {BUTTON_REVEAL_VOTES}
      </button>
    </div>
  );
};

export const RevealButton = connectToWebSocket(ProtoRevealButton);
