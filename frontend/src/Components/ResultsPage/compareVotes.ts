import { CardValue } from '../../../../shared/cards';

export const compareVotes = (
  [user1, value1]: [string, CardValue],
  [user2, value2]: [string, CardValue]
) => {
  return compareCardValues(value1, value2) || (user1 > user2 ? 1 : -1);
};

export const compareCardValues = (value1: CardValue, value2: CardValue) => {
  if (isNaN(Number(value1)) && !isNaN(Number(value2))) return 1;
  if (!isNaN(Number(value1)) && isNaN(Number(value2))) return -1;
  if (isNaN(Number(value1)) && isNaN(Number(value2))) {
    if (value1.toLowerCase() > value2.toLowerCase()) return 1;
    if (value1.toLowerCase() < value2.toLowerCase()) return -1;
  } else {
    if (Number(value1) > Number(value2)) return 1;
    if (Number(value1) < Number(value2)) return -1;
  }

  return 0;
};
