import { Votes, WebSocketApi } from '../types/WebSocket';
import classes from './RevealButton.module.css';
import { connectToWebSocket } from './WebSocket';
import { BUTTON_REVEAL_VOTES, VOTE_NOTE_VOTED } from '../constants';
import { useEffect, useState } from 'preact/hooks';

const ProtoRevealButton = ({
  socket: {
    loginData: { user },
    revealVotes,
    state: { votes },
  },
}: {
  socket: WebSocketApi;
}) => {
  const [hasRequestedReveal, setHasRequestedReveal] = useState(false);
  useEffect(() => {
    if (hasRequestedReveal && getNumberOfMissingVotes(votes, user) === 0) {
      revealVotes();
    }
  }, [votes, user]);

  if (hasRequestedReveal) {
    return (
      <div class={classes.revealButtonContainer}>
        <div>waiting for {getNumberOfMissingVotes(votes, user)} missing votes…</div>
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
          if (getNumberOfMissingVotes(votes, user) > 0) {
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

const getNumberOfMissingVotes = (votes: Votes, currentUser: string): number =>
  Object.entries(votes).filter(([user, vote]) => vote === VOTE_NOTE_VOTED && user !== currentUser)
    .length;

export const RevealButton = connectToWebSocket(ProtoRevealButton);
