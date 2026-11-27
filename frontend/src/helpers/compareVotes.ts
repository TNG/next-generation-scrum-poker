import { CARDS_ORDERED_BY_VALUE, CardValue } from '../../../shared/cards';
import { UserState } from './getVotingState';

const positionInScale = (scale: CardValue[], value: CardValue) => {
  const index = scale.indexOf(value);
  return index === -1 ? Infinity : index;
};

const predefinedOrder = (value: CardValue) => CARDS_ORDERED_BY_VALUE.get(value) ?? Infinity;

const compareNumbers = (number1: number, number2: number) =>
  number1 === number2 ? 0 : number1 > number2 ? 1 : -1;

export const compareVotes = (
  scale: CardValue[],
  userState1: Pick<UserState, 'user' | 'vote'>,
  userState2: Pick<UserState, 'user' | 'vote'>,
) => {
  return (
    compareCardValues(scale, userState1.vote, userState2.vote) ||
    (userState1.user > userState2.user ? 1 : -1)
  );
};

export const compareCardValues = (scale: CardValue[], value1: CardValue, value2: CardValue) => {
  return (
    compareNumbers(positionInScale(scale, value1), positionInScale(scale, value2)) ||
    compareNumbers(predefinedOrder(value1), predefinedOrder(value2))
  );
};
