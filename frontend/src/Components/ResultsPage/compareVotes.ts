import { CardValue, isSize, SIZES_ORDERED } from '../../../../shared/cards';

export const compareVotes = (
  [user1, value1]: [string, CardValue],
  [user2, value2]: [string, CardValue]
) => {
  return compareCardValues(value1, value2) || (user1 > user2 ? 1 : -1);
};

export const compareCardValues = (value1: CardValue, value2: CardValue) => {
  const numericValue1 = isSize(value1) ? SIZES_ORDERED.indexOf(value1) : Number(value1);
  const numericValue2 = isSize(value2) ? SIZES_ORDERED.indexOf(value2) : Number(value2);
  if (isNaN(numericValue1) && !isNaN(numericValue2)) return 1;
  if (!isNaN(numericValue1) && isNaN(numericValue2)) return -1;
  if (isNaN(numericValue1) && isNaN(numericValue2)) {
    if (value1.toLowerCase() > value2.toLowerCase()) return 1;
    if (value1.toLowerCase() < value2.toLowerCase()) return -1;
  } else {
    if (numericValue1 > numericValue2) return 1;
    if (numericValue1 < numericValue2) return -1;
  }

  return 0;
};
