import { CardValue } from '../../shared/WebSocketMessages';

export const compareVotes = (
  userAndVote1: [string, CardValue],
  userAndVote2: [string, CardValue]
) => {
  const vote1 = userAndVote1[1];
  const vote2 = userAndVote2[1];

  if (isNaN(Number(vote1)) && !isNaN(Number(vote2))) return 1;
  else if (!isNaN(Number(vote1)) && isNaN(Number(vote2))) return -1;
  else if (isNaN(Number(vote1)) && isNaN(Number(vote2))) {
    if (vote1.toLowerCase() > vote2.toLowerCase()) return 1;
    if (vote1.toLowerCase() < vote2.toLowerCase()) return -1;
  } else {
    if (Number(vote1) > Number(vote2)) return 1;
    if (Number(vote1) < Number(vote2)) return -1;
  }

  const user1 = userAndVote1[0];
  const user2 = userAndVote2[0];
  return user1 > user2 ? 1 : -1;
};
