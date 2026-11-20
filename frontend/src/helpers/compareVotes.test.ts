import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { SCALES } from '../../../shared/scales';
import { compareCardValues, compareVotes } from './compareVotes';
import { UserState } from './getVotingState';

const COHEN_SCALE = SCALES.COHEN_SCALE.values;
const SIZES_SCALE = SCALES.SIZES_SCALE.values;
const CUSTOM_SCALE = ['C', 'B', 'A'];
const REVERSED_SIZES_SCALE = ['L', 'M', 'S'];

describe('The compareVotes function', () => {
  it.each<{
    scale: CardValue[];
    userState1: Pick<UserState, 'user' | 'vote'>;
    userState2: Pick<UserState, 'user' | 'vote'>;
    result: number;
  }>([
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: '100' },
      userState2: { user: 'user2', vote: '5' },
      result: 1,
    },
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: '0.5' },
      userState2: { user: 'user2', vote: '5' },
      result: -1,
    },
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: '5' },
      userState2: { user: 'user2', vote: VOTE_COFFEE },
      result: -1,
    },
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: '5' },
      result: 1,
    },
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: VOTE_COFFEE },
      result: -1,
    },
    {
      scale: COHEN_SCALE,
      userState1: { user: 'user1', vote: VOTE_COFFEE },
      userState2: { user: 'user2', vote: VOTE_NOTE_VOTED },
      result: -1,
    },
    {
      scale: SIZES_SCALE,
      userState1: { user: 'user1', vote: 'S' },
      userState2: { user: 'user2', vote: VOTE_OBSERVER },
      result: -1,
    },
    {
      scale: CUSTOM_SCALE,
      userState1: { user: 'user1', vote: 'A' },
      userState2: { user: 'user2', vote: 'C' },
      result: 1,
    },
    {
      scale: CUSTOM_SCALE,
      userState1: { user: 'user1', vote: 'C' },
      userState2: { user: 'user2', vote: 'B' },
      result: -1,
    },
    {
      scale: CUSTOM_SCALE,
      userState1: { user: 'user1', vote: 'B' },
      userState2: { user: 'user2', vote: 'B' },
      result: -1,
    },
    {
      scale: CUSTOM_SCALE,
      userState1: { user: 'user1', vote: 'B' },
      userState2: { user: 'user2', vote: VOTE_OBSERVER },
      result: -1,
    },
  ])(
    'returns $result for $userState1 and $userState2',
    ({ scale, userState1, userState2, result }) => {
      expect(compareVotes(scale, userState1, userState2)).toEqual(result);
    },
  );
});

describe('The compareCardValues function', () => {
  it.each<{ scale: CardValue[]; value1: CardValue; value2: CardValue; result: number }>([
    { scale: COHEN_SCALE, value1: '∞', value2: '100', result: 1 },
    { scale: COHEN_SCALE, value1: '100', value2: '5', result: 1 },
    { scale: COHEN_SCALE, value1: '0.5', value2: '5', result: -1 },
    { scale: COHEN_SCALE, value1: '5', value2: VOTE_COFFEE, result: -1 },
    { scale: COHEN_SCALE, value1: VOTE_COFFEE, value2: '5', result: 1 },
    { scale: COHEN_SCALE, value1: VOTE_COFFEE, value2: VOTE_COFFEE, result: 0 },
    { scale: COHEN_SCALE, value1: VOTE_COFFEE, value2: VOTE_NOTE_VOTED, result: -1 },
    { scale: SIZES_SCALE, value1: '∞', value2: 'M', result: 1 },
    { scale: SIZES_SCALE, value1: 'S', value2: 'M', result: -1 },
    { scale: SIZES_SCALE, value1: 'XL', value2: VOTE_OBSERVER, result: -1 },
    { scale: SIZES_SCALE, value1: 'XS', value2: 'M', result: -1 },
    { scale: SIZES_SCALE, value1: 'XXS', value2: 'XS', result: -1 },
    { scale: SIZES_SCALE, value1: 'XXS', value2: 'L', result: -1 },
    { scale: SIZES_SCALE, value1: 'XXL', value2: 'XS', result: 1 },
    { scale: SIZES_SCALE, value1: VOTE_OBSERVER, value2: 'S', result: 1 },
    { scale: SIZES_SCALE, value1: VOTE_COFFEE, value2: 'XL', result: 1 },
  ])(
    'returns $result when $value1 and $value2 are compared on a predefined scale',
    ({ scale, value1, value2, result }) => {
      expect(compareCardValues(scale, value1, value2)).toEqual(result);
    },
  );

  it.each<{ scale: CardValue[]; value1: CardValue; value2: CardValue; result: number }>([
    { scale: CUSTOM_SCALE, value1: 'C', value2: 'B', result: -1 },
    { scale: CUSTOM_SCALE, value1: 'A', value2: 'C', result: 1 },
    { scale: CUSTOM_SCALE, value1: 'B', value2: 'B', result: 0 },
    { scale: CUSTOM_SCALE, value1: 'B', value2: VOTE_NOTE_VOTED, result: -1 },
    { scale: CUSTOM_SCALE, value1: VOTE_NOTE_VOTED, value2: VOTE_OBSERVER, result: -1 },
    { scale: CUSTOM_SCALE, value1: 'UNKNOWN', value2: 'ALSO-UNKNOWN', result: 0 },
    { scale: REVERSED_SIZES_SCALE, value1: 'S', value2: 'L', result: 1 },
  ])(
    'returns $result when $value1 and $value2 are compared on scale $scale',
    ({ scale, value1, value2, result }) => {
      expect(compareCardValues(scale, value1, value2)).toEqual(result);
    },
  );
});
