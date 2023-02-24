import { ALL_VALUES_ORDERED, CardValue } from '../../../../shared/cards';

export const compareVotes = (
  [user1, value1]: [string, CardValue],
  [user2, value2]: [string, CardValue]
) => {
  return compareCardValues(value1, value2) || (user1 > user2 ? 1 : -1);
};

export const compareCardValues = (value1: CardValue, value2: CardValue) => {
  if (ALL_VALUES_ORDERED.indexOf(value1) > ALL_VALUES_ORDERED.indexOf(value2)) return 1;
  if (ALL_VALUES_ORDERED.indexOf(value1) < ALL_VALUES_ORDERED.indexOf(value2)) return -1;
  return 0;
};
