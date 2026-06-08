import { CardValue, VOTE_HIDDEN, VOTE_NOTE_VOTED, VOTE_OBSERVER } from './cards';

/**
 * Determines which vote value may be transmitted to a given client.
 *
 * Before the votes are revealed, the actual value of another participant's vote
 * must never leave the server, otherwise it can be read from the WebSocket
 * traffic. We therefore replace cast votes with the VOTE_HIDDEN placeholder
 * while results are hidden. The recipient's own vote, abstaining (not-voted)
 * and observer states stay untouched so the UI keeps working.
 */
export const getVisibleVote = (
  vote: CardValue,
  { resultsVisible, ownVote }: { resultsVisible: boolean; ownVote: boolean },
): CardValue => {
  if (resultsVisible || ownVote) {
    return vote;
  }
  if (vote === VOTE_NOTE_VOTED || vote === VOTE_OBSERVER) {
    return vote;
  }
  return VOTE_HIDDEN;
};
