import { CARDS_ORDERED_BY_VALUE, CardValue } from '../../../../shared/cards';

export const compareVotes = (
  [user1, value1]: [string, CardValue],
  [user2, value2]: [string, CardValue]
) => {
  return compareCardValues(value1, value2) || (user1 > user2 ? 1 : -1);
};

export const compareCardValues = (value1: CardValue, value2: CardValue) => {
  const numericValue1 = CARDS_ORDERED_BY_VALUE.get(value1) ?? Infinity;
  const numericValue2 = CARDS_ORDERED_BY_VALUE.get(value2) ?? Infinity;
  if (numericValue1 > numericValue2) return 1;
  if (numericValue1 < numericValue2) return -1;
  return 0;
};
