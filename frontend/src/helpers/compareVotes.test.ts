import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { compareCardValues, compareVotes } from './compareVotes';
import { UserState } from './getVotingState';

describe('The compareVotes function', () => {
  it.each<{
    userState1: Pick<UserState, 'user' | 'vote'>;
    userState2: Pick<UserState, 'user' | 'vote'>;
    result: number;
  }>([
    {
      userState1: { user: 'user1', vote: '100' },
      userState2: { user: 'user2', vote: '5' },
      result: 1,
    },
    {
      userState1: { user: 'user1', vote: '0.5' },
      userState2: { user: 'user2', vote: '5' },
      result: -1,
    },
    {
      userState1: { user: 'user1', vote: '5' },
      userState2: { user: 'user2', vote: VOTE_COFFEE },
      result: -1,
    },
    {
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: '5' },
      result: 1,
    },
    {
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: VOTE_COFFEE },
      result: -1,
    },
    {
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: VOTE_NOTE_VOTED },
      result: -1,
    },
    {
      userState1: { user: 'user1', vote: 'S' },
      userState2: { user: 'user1', vote: VOTE_OBSERVER },
      result: -1,
    },
  ])(
    'returns $result when $userAndVote1 and $userAndVote2 are passed',
    ({ userState1, userState2, result }) => {
      const sortedResults = compareVotes(userState1, userState2);
      expect(sortedResults).toEqual(result);
    },
  );
});

describe('The compareCardValues function', () => {
  it.each<{ value1: CardValue; value2: CardValue; result: number }>([
    { value1: '∞', value2: '100', result: 1 },
    { value1: '100', value2: '5', result: 1 },
    { value1: '0.5', value2: '5', result: -1 },
    { value1: '5', value2: VOTE_COFFEE, result: -1 },
    { value1: VOTE_COFFEE, value2: '5', result: 1 },
    { value1: VOTE_COFFEE, value2: VOTE_COFFEE, result: 0 },
    { value1: VOTE_COFFEE, value2: VOTE_NOTE_VOTED, result: -1 },
  ])('returns $result when $value1 and $value2 are passed', ({ value1, value2, result }) => {
    const sortedResults = compareCardValues(value1, value2);
    expect(sortedResults).toEqual(result);
  });

  it.each<{ value1: CardValue; value2: CardValue; result: number }>([
    { value1: '∞', value2: 'M', result: 1 },
    { value1: 'S', value2: 'M', result: -1 },
    { value1: 'XL', value2: VOTE_OBSERVER, result: -1 },
    { value1: 'XS', value2: 'M', result: -1 },
    { value1: 'XXS', value2: 'XS', result: -1 },
    { value1: 'XXS', value2: 'L', result: -1 },
    { value1: 'XXL', value2: 'XS', result: 1 },
    { value1: VOTE_OBSERVER, value2: 'S', result: 1 },
    { value1: VOTE_COFFEE, value2: 'XL', result: 1 },
  ])(
    'returns $result when $value1 and $value2 are passed for sizes',
    ({ value1, value2, result }) => {
      const sortedResults = compareCardValues(value1, value2);
      expect(sortedResults).toEqual(result);
    },
  );
});
