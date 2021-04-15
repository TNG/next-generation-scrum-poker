import { Votes, WebSocketApi } from '../types/WebSocket';
import classes from './RevealButton.module.css';
import { connectToWebSocket } from './WebSocket';
import { BUTTON_REVEAL_NOW, BUTTON_REVEAL_VOTES, VOTE_NOTE_VOTED } from '../constants';

const ProtoRevealButton = ({
  socket: {
    loginData: { user },
    revealVotes,
    state: { votes },
  },
}: {
  socket: WebSocketApi;
}) => {
  const missingVotes = getNumberOfMissingVotes(votes, user);
  if (missingVotes > 0) {
    return (
      <button class={classes.revealNowButton} onClick={revealVotes}>
        <div class={classes.revealNowButtonInfo}>{missingVotes} missing votes</div>
        {BUTTON_REVEAL_NOW}
      </button>
    );
  }
  return (
    <button class={classes.revealButton} onClick={revealVotes}>
      {BUTTON_REVEAL_VOTES}
    </button>
  );
};

const getNumberOfMissingVotes = (votes: Votes, currentUser: string): number =>
  Object.entries(votes).filter(([user, vote]) => vote === VOTE_NOTE_VOTED && user !== currentUser)
    .length;

export const RevealButton = connectToWebSocket(ProtoRevealButton);
