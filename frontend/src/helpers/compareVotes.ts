import { CARDS_ORDERED_BY_VALUE, CardValue } from '../../../shared/cards';
import { UserState } from './getVotingState';

export const compareVotes = (
  userState1: Pick<UserState, 'user' | 'vote'>,
  userState2: Pick<UserState, 'user' | 'vote'>,
) => {
  return (
    compareCardValues(userState1.vote, userState2.vote) ||
    (userState1.user > userState2.user ? 1 : -1)
  );
};

export const compareCardValues = (value1: CardValue, value2: CardValue) => {
  const numericValue1 = CARDS_ORDERED_BY_VALUE.get(value1) ?? Infinity;
  const numericValue2 = CARDS_ORDERED_BY_VALUE.get(value2) ?? Infinity;
  if (numericValue1 > numericValue2) return 1;
  if (numericValue1 < numericValue2) return -1;
  return 0;
};
