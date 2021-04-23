import { loginUser } from './login-user';
import { setScale } from './set-scale';
import { revealVotes } from './reveal-votes';
import { setVote } from './set-vote';
import { resetVotes } from './reset-votes';
import { removeUsersNotVoted } from './remove-users-not-voted';
import { Config, Payload } from './types';

export const message = async (type: any, payload: Payload, config: Config) => {
  try {
    switch (type) {
      case 'login':
        await loginUser(payload.user!, payload.session!, config);
        break;
      case 'set-scale':
        await setScale(payload.scale!, config);
        break;
      case 'reveal-votes':
        await revealVotes(config);
        break;
      case 'set-vote':
        await setVote(payload.vote!, config);
        break;
      case 'reset-votes':
        await resetVotes(config);
        break;
      case 'remove-users-not-voted':
        await removeUsersNotVoted(config);
        break;
    }
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
