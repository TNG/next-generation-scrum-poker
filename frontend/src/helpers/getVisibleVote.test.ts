import { describe, expect, it } from 'vitest';
import { VOTE_HIDDEN, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { getVisibleVote } from '../../../shared/getVisibleVote';

describe('getVisibleVote', () => {
  it('hides a cast vote of another user while results are hidden', () => {
    expect(getVisibleVote('5', { resultsVisible: false, ownVote: false })).toBe(VOTE_HIDDEN);
  });

  it('keeps the recipient own vote visible while results are hidden', () => {
    expect(getVisibleVote('5', { resultsVisible: false, ownVote: true })).toBe('5');
  });

  it('reveals the real vote of another user once results are visible', () => {
    expect(getVisibleVote('5', { resultsVisible: true, ownVote: false })).toBe('5');
  });

  it('never hides the not-voted state', () => {
    expect(getVisibleVote(VOTE_NOTE_VOTED, { resultsVisible: false, ownVote: false })).toBe(
      VOTE_NOTE_VOTED,
    );
  });

  it('never hides the observer state', () => {
    expect(getVisibleVote(VOTE_OBSERVER, { resultsVisible: false, ownVote: false })).toBe(
      VOTE_OBSERVER,
    );
  });
});
