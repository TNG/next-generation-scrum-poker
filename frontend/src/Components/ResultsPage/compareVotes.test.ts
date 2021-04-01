import { compareVotes } from './compareVotes';

describe('The compareVotes function', () => {
  it.each`
    userAndVote1           | userAndVote2              | result
    ${['user1', '100']}    | ${['user2', '5']}         | ${1}
    ${['user1', '0.5']}    | ${['user2', '5']}         | ${-1}
    ${['user1', '5']}      | ${['user2', 'coffee']}    | ${-1}
    ${['user1', 'coffee']} | ${['user2', '5']}         | ${1}
    ${['user1', 'coffee']} | ${['user2', 'coffee']}    | ${-1}
    ${['user1', 'coffee']} | ${['user2', 'not-voted']} | ${-1}
  `(
    'return $result when $userAndVote1 and $userAndVote2 are passed',
    ({ userAndVote1, userAndVote2, result }) => {
      const sortedResults = compareVotes(userAndVote1, userAndVote2);
      expect(sortedResults).toEqual(result);
    }
  );
});
