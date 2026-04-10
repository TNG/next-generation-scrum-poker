import { CardValue } from '../../../shared/cards';
import { UserState } from './getVotingState';

export const compareVotes =
  (scale: CardValue[]) =>
  (userState1: Pick<UserState, 'user' | 'vote'>, userState2: Pick<UserState, 'user' | 'vote'>) => {
    const rankDifference =
      getVoteRank(userState1.vote, scale) - getVoteRank(userState2.vote, scale);
    return rankDifference !== 0 ? rankDifference : userState1.user > userState2.user ? 1 : -1;
  };

// Votes are ranked by their position in the active scale. Values that are not part of the scale
// (the appended observer card and not-voted) are ranked last, so they sort below the actual votes.
const getVoteRank = (vote: CardValue, scale: CardValue[]) => {
  const index = scale.indexOf(vote);
  return index === -1 ? scale.length : index;
};
