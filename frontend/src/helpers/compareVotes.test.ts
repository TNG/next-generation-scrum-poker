import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { SCALES } from '../../../shared/scales';
import { compareVotes } from './compareVotes';
import { UserState } from './getVotingState';

describe('The compareVotes function', () => {
  const fibonacci = SCALES.FIBONACCI_SCALE.values;

  it.each<{
    scale: CardValue[];
    userState1: Pick<UserState, 'user' | 'vote'>;
    userState2: Pick<UserState, 'user' | 'vote'>;
    result: number;
  }>([
    // Sorted by their position in the active scale.
    {
      scale: fibonacci,
      userState1: { user: 'user1', vote: '89' },
      userState2: { user: 'user2', vote: '5' },
      result: 1,
    },
    {
      scale: fibonacci,
      userState1: { user: 'user1', vote: '5' },
      userState2: { user: 'user2', vote: VOTE_COFFEE },
      result: -1,
    },
    // Custom scales sort by the order the creator chose, even when the tokens coincide with
    // predefined ones in the opposite order (this is what the old global-map sort got wrong).
    {
      scale: ['M', 'S'],
      userState1: { user: 'user1', vote: 'M' },
      userState2: { user: 'user2', vote: 'S' },
      result: -1,
    },
    {
      scale: ['LOW', 'MED', 'HI'],
      userState1: { user: 'user1', vote: 'HI' },
      userState2: { user: 'user2', vote: 'LOW' },
      result: 1,
    },
    // Votes outside the scale (observer, not-voted) rank after the actual votes.
    {
      scale: fibonacci,
      userState1: { user: 'user1', vote: '5' },
      userState2: { user: 'user2', vote: VOTE_OBSERVER },
      result: -1,
    },
    {
      scale: fibonacci,
      userState1: { user: 'user1', vote: VOTE_NOTE_VOTED },
      userState2: { user: 'user2', vote: '0' },
      result: 1,
    },
    // Equal rank falls back to the username.
    {
      scale: fibonacci,
      userState1: { user: 'user1', vote: '5' },
      userState2: { user: 'user2', vote: '5' },
      result: -1,
    },
  ])(
    'returns $result for votes $userState1.vote and $userState2.vote with scale $scale',
    ({ scale, userState1, userState2, result }) => {
      // Only the sign matters to Array.prototype.sort.
      expect(Math.sign(compareVotes(scale)(userState1, userState2))).toEqual(result);
    },
  );
});
