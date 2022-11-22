import { CardValue } from '../../../../shared/cards';
import { compareCardValues, compareVotes } from './compareVotes';

describe('The compareVotes function', () => {
  it.each([
    [['user1', '100'], ['user2', '5'], 1],
    [['user1', '0.5'], ['user2', '5'], -1],
    [['user1', '5'], ['user2', 'coffee'], -1],
    [['user1', 'coffee'], ['user2', '5'], 1],
    [['user1', 'coffee'], ['user2', 'coffee'], -1],
    [['user1', 'coffee'], ['user2', 'not-voted'], -1],
  ] as [[string, CardValue], [string, CardValue], number][])(
    'when %j and %j are passed returns %d',
    (userAndVote1, userAndVote2, result) => {
      const sortedResults = compareVotes(userAndVote1, userAndVote2);
      expect(sortedResults).toEqual(result);
    }
  );
});

describe('The compareCardValues function', () => {
  it.each([
    ['∞', '100', 1],
    ['100', '5', 1],
    ['0.5', '5', -1],
    ['5', 'coffee', -1],
    ['coffee', '5', 1],
    ['coffee', 'coffee', 0],
    ['coffee', 'not-voted', -1],
  ] as [CardValue, CardValue, number][])(
    'when %s and %s are passed returns %d',
    (value1, value2, result) => {
      const sortedResults = compareCardValues(value1, value2);
      expect(sortedResults).toEqual(result);
    }
  );
});
